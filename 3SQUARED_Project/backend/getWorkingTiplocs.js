const fs = require('fs');

// gets the tiplocs with trains for that day
export function getWorkingTiplocs(tiplocArray, tiplocsAtOnce, startDate, endDate, headers) {
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
        fetch(`API/`, { headers: headers })
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
                fs.writeFileSync('tiplocs.json', JSON.stringify(workingTiplocs, null, 2), 'utf-8')
            }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
}

