const fs = require('fs');
const 
fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
 getWorkingTiplocs :  function (tiplocArray, tiplocsAtOnce, startDate, endDate ) {
    const options = {
	method: 'GET',
	headers: {
		'X-ApiKey': 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A',
		'X-ApiVersion': '1'
	}
};
    let createNew = true;
    let temp;
    let workingTiplocs;
    // loops through the list of tiplocs
    for (let i = 0; i < tiplocArray.length; i += tiplocsAtOnce) {
        if ((i+tiplocsAtOnce) <= tiplocArray.length) {
            temp = (tiplocArray.slice(i, i+tiplocsAtOnce)).toString(); // gets max tiplocs you can call at once into a string
        } else {
            temp = (tiplocArray.slice(i, tiplocArray.length)).toString(); // gets the remaining tiplocs
        }
        fetch(`https://traindata-stag-api.railsmart.io/api/trains/tiploc/${temp}/${startDate} 00:00:00/${endDate} 23:59:59`, options)
        .then(res => res.json())
        .then(data => {
            // checks if data is empty
            
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
                console.dir(workingTiplocs)
                fs.writeFileSync('tiplocs.json', JSON.stringify(workingTiplocs, null, 2), 'utf-8')
            }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
}
}