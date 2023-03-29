const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const headers = new Headers();
headers.append('X-ApiKey', 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A');
headers.append('X-ApiVersion', '1');

dateStart = "2023-03-28"
dateEnd = "2023-03-28"

router.use(express.static("./public"))

//router
router.get('/Tiplocs/:tiploc', async (req, res) => 
{
  var tiploc =(req.params.tiploc);
  
  await fetch(`https://traindata-stag-api.railsmart.io/api/trains/tiploc/${tiploc}/${dateStart} 00:00:00/${dateEnd} 23:59:59`, { headers: headers })
  .then(res => res.json())
  .then(data => {
    if (data.length == 0)
    {
        console.log(`${tiploc} is empty`)
        console.log(data)
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
        //console.log('in Schedule')
        res.json({data})
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
})



router.get('/Movements/:activation/:schedule', async (req, res) => 
{
  var activation =(req.params.activation);
  var schedule =(req.params.schedule);
  console.log(`${activation} and ${schedule}`)
  await fetch(`https://traindata-stag-api.railsmart.io/api/ifmtrains/movement/${activation}/${schedule}`, { headers: headers })
  .then(res => res.json())
  .then(data => {
        //console.log('in movements:' + data)
        res.json({data})
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
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