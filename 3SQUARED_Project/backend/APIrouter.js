const express = require('express');
const router = express.Router();
const path = require('path');

const headers = new Headers();
headers.append('X-ApiKey', 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A');
headers.append('X-ApiVersion', '1');

dateStart = "2023-03-27"
dateEnd = "2023-03-27"

router.use(express.static(__dirname + '/..' + '/frontend'))
router.use(express.static(__dirname + '/..' + '/backend'))

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
  await fetch(`https://traindata-stag-api.railsmart.io/api/ifmtrains/movement/${activation}/${schedule}`, { headers: headers }) 
  .then(res => res.json())
  .then(data => {
    if (data.length == 0)
    {
        console.log(`${activation}/${schedule} is empty`)
    }
    else
    {
      console.log('in schedule')
        res.json({"data" : data})
    }
    

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
    if (data.length == 0)
    {
        console.log(`${activation}/${schedule} is empty`)
    }
    else
    {
      console.log('in movements')
        res.json({"data" : data})
    }
    

  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
})


module.exports = router