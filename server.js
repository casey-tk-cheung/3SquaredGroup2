const express = require ('express');
const app = express(); //initialise the server
const path = require('path');
const port = process.env.PORT || 3000;
const WorkingTipLocs = require('./getWorkingTiplocs.js')
const jsonFile = require("./allTiplocs.json");


app.use(express.static("./public"));

WorkingTipLocs.getWorkingTiplocs(jsonFile, 25, '2023-02-16', '2023-02-16')



app.listen(port, () =>{
  console.log(`listening on port ${port}`)
})