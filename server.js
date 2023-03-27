const express = require ('express');
const app = express(); //initialise the server
const path = require('path');
const port = process.env.PORT || 3000;
//const jsonFile = require("./allTiplocs.json");
const fs = require('fs');
const tiplocArray = require("./allTiplocs.json");
const https = require("https");
const server = https.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


//static asset directories
app.use(express.static("./public"));

//router for API calls
const APIRouter = require('./APIrouter.js');
app.use('/API', APIRouter);

server.listen(`${port}`, () => {
  console.log('listening on :3000');
});

//need error handling for if the connection times out;
//in general, too many requests and the webpage 'freezes'


const headers = new Headers();
headers.append('X-ApiKey', 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A');
headers.append('X-ApiVersion', '1');

dateStart = "2023-03-27"
dateEnd = "2023-03-27"
tiplocsAtOnce = 25


//need error handling for if the connection times out;
//in general, too many requests and the webpage 'freezes'

io.on('connection', async (socket) => {
  let createNew = true;
  let temp;
  let workingTiplocs;
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)
  //console.log(tiplocArray)
  // loops through the list of tiplocs
  for (let i = 0; i < tiplocArray.length; i += tiplocsAtOnce) {
      if ((i+tiplocsAtOnce) <= tiplocArray.length) {
          temp = (tiplocArray.slice(i, i+tiplocsAtOnce)).toString(); // gets max tiplocs you can call at once into a string
      } else {
          temp = (tiplocArray.slice(i, tiplocArray.length)).toString(); // gets the remaining tiplocs
      }
      await fetch(`https://traindata-stag-api.railsmart.io/api/trains/tiploc/${temp}/${dateStart} 00:00:00/${dateEnd} 23:59:59`, { headers: headers }, {signal: controller.signal})
      .then(res => res.json())
      .then(data => {
          // checks if data is empty
          //console.log(data)
          clearTimeout(timeoutId)
          if (data.length != 0) {
              for (let k = 0; k < data.length; k++) {
                  const originLocation = data[k].originLocation;
                  const originTiploc = data[k].originTiploc;
                  data[k] = {originLocation, originTiploc};
              }
              if (createNew) {
                  createNew = false;
                  workingTiplocs = data;
              }
              else {
                  workingTiplocs = workingTiplocs.concat(data);
              }
              fs.writeFileSync('./public/tiplocs.json', JSON.stringify(workingTiplocs, null, 2), {encoding:'utf8',flag:'w'})
          }
          })
          .catch(error => {
              console.error('Error fetching data:', error);
          });
  }
});