const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const headers = new Headers();
headers.append('X-ApiKey', 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A');
headers.append('X-ApiVersion', '1');


var date = new Date();
var day = String(date.getDate()).padStart(2, '0');
var month = String(date.getMonth() + 1).padStart(2, '0');
var year = date.getFullYear();
//dateStart, dateEnd = year + '-' + month + '-' + day;
const now = new Date();
const ukTime = now.toLocaleString('en-GB');

var date = ukTime.split("/");
var day = date[0];
var month = date[1];
var year = date[2].substring(0, 4);
var dateStart = year + '-' + month + '-' + day;
var dateEnd = year + '-' + month + '-' + day;


router.use(express.static("./public"))

//router
router.get('/Tiplocs/:tiploc', async (req, res) => {
  var tiploc = (req.params.tiploc);

  await fetch(`https://traindata-stag-api.railsmart.io/api/trains/tiploc/${tiploc}/${dateStart} 00:00:00/${dateEnd} 23:59:59`, { headers: headers })

  .then(res => res.json())
  .then(data => {
    if (data.length == 0)
    {
        console.log(`${tiploc} is empty`)
    }
    else
    {
      console.log('here in tiplocs')
        res.json({"data" : data})
    }
    

  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
})

router.get('/Schedule/:activation/:schedule', async (req, res) => 
{
  var activation =(req.params.activation);
  var schedule =(req.params.schedule);
  console.log(`${activation} and ${schedule}`)
  await fetch(`https://traindata-stag-api.railsmart.io/api/ifmtrains/schedule/${activation}/${schedule}`, { headers: headers })
  .then(res => res.json())
  .then(data => {
        console.log('in Schedule')
        res.json({data})
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
})



router.get('/Movements/:activation/:schedule', async (req, res) => {
  var activation = (req.params.activation);
  var schedule = (req.params.schedule);
  console.log(`${activation} and ${schedule}`)
  await fetch(`https://traindata-stag-api.railsmart.io/api/ifmtrains/movement/${activation}/${schedule}`, { headers: headers })

  .then(res => res.json())
  .then(data => {
        console.log('in movements')
        res.json({data})
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
})


router.get('/writeE/:activation/:schedule', async (req, res) => 
{
  var activationId = req.params.activation;
  var scheduleId = req.params.schedule;

  var test = activationId + '/' + scheduleId;
  fs.writeFileSync('./public/movementTiploc.json', JSON.stringify({'activationId' : activationId, 'scheduleId' : scheduleId}, null, 2), {encoding:'utf8',flag:'w'});
  //fs.writeFileSync('./movementTiploc.txt', test, {encoding:'utf8',flag:'w'});
  res.json({data: "ok"})
})

router.get('/Movements_updates/:activation/:schedule', async (req, res) => 
{
  var activation =(req.params.activation);
  var schedule =(req.params.schedule);
  console.log(`${activation} and ${schedule}`)
  await fetch(`https://traindata-stag-api.railsmart.io/api/ifmtrains/movement/${activation}/${schedule}`, { headers: headers })
  .then(res => res.json())
  .then(data => {
        //console.log('in movements:' + data)
        fs.writeFileSync(`./public/js/movements.json`, JSON.stringify(data, null, 2), 'utf-8');
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

})


module.exports = router
