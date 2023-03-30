async function route(e) {
    //changed instances of 'e.currentTarget' to 'e.explicitOriginalTarget' to facilitate reloading
    var activationId = e.srcElement.activationId;
    var scheduleId = e.srcElement.scheduleId;
    var headCode = e.srcElement.headCode;
    var destinationLocation = e.srcElement.destinationLocation;
    var originLocation = e.srcElement.originLocation;
    var route = [];
    var left = [];
    var passGroup = new L.layerGroup();
    const headers = new Headers();
    headers.append('X-ApiKey', 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A');
    headers.append('X-ApiVersion', '1');

    var allMovementData;
    var lastVisitedTiploc;
    var scheduleData;
    await fetch('https://traindata-stag-api.railsmart.io/api/ifmtrains/movement/'
        + activationId + '/' + scheduleId, { headers: headers })
        .then(response => response.json())
        .then(data => {
            allMovementData = data;
            if (data.length != 0)
                lastVisitedTiploc = data[data.length - 1].tiploc;
            else lastVisitedTiploc = 0;
        })

    fetch('https://traindata-stag-api.railsmart.io/api/ifmtrains/schedule/' + activationId + '/' + scheduleId, { headers: headers })
        .then(response => response.json())
        .then(data => {
            scheduleData = data;
            while (!data[data.length - 1].hasOwnProperty('latLong')) data.pop()
            var completedJourney = true;
            for (const item of data) {
                if (item.hasOwnProperty('latLong')) {
                    if (lastVisitedTiploc == 0) {
                        lastVisitedTiploc = data[data.indexOf(item)].tiploc;
                    }
                    var latlng = [item.latLong.latitude, item.latLong.longitude];
                    if (completedJourney) {
                        route.push(latlng);
                    }
                    else {
                        left.push(latlng)
                    }
                    if (item.tiploc == lastVisitedTiploc) // finds last visited tiploc
                    {
                        completedJourney = false;
                        left.push(latlng);
                    }
                }

                //Create departure markers
                var btn = document.getElementById("tiplocBtn");
                if (item.hasOwnProperty('latLong') && item.hasOwnProperty('departure') &&
                    (item != data[0] && item != data[data.length[-1]])) {
                    var marker = new L.marker([item.latLong.latitude, item.latLong.longitude], { icon: station })
                        .addTo(map)
                        .bindPopup(item.location + ' - Expected Arrival: ' + item.arrival +
                            ' / Expected Departure: ' + item.departure);
                }
                //Create all other markers, if showing all station passes is enabled via button
                if (item.hasOwnProperty('latLong') && item.hasOwnProperty('pass') && btn.innerHTML == "Hide Station Passes" &&
                    (item != data[0] && item != data[data.length[-1]])) {
                    var marker = new L.marker([item.latLong.latitude, item.latLong.longitude], { icon: dot })
                        .addTo(passGroup)
                        .bindPopup(item.location + ' - Expected Pass Time: ' + item.pass);
                }
            }
            map.addLayer(passGroup); //Add pass markers to layer group
            var fullRoute = route.concat(left);
            var grid = document.getElementById('journeyInfo-grid');
            var hc = document.getElementById('headCode');
            if (hc != 0) {
                hc.innerHTML = ("Head Code: " + headCode);
            }


            var marker1 = new L.marker(left[0], { icon: train }).bindPopup(headCode + '  ||  ' + originLocation + ' - ' + destinationLocation).addTo(map);
            marker1.setZIndexOffset(1000);
            new L.marker(route[0], { icon: locationIcon }).bindPopup(data[0].location).addTo(map);
            new L.marker(left[left.length - 1], { icon: locationIcon }).bindPopup(data[data.length - 1].location).addTo(map);
            if (route.length != 0) {
                const path = L.polyline.antPath(route, { // completed journey
                    "delay": 800,
                    "dashArray": [
                        10,
                        20
                    ],
                    "weight": 5,
                    "color": "#00FF00",
                    "pulseColor": "#FFFFFF",
                    "paused": false,
                    "reverse": false,
                    "hardwareAccelerated": true
                });
                map.addLayer(path);
            }
            if (left.length != 0) {
                const path2 = L.polyline.antPath(left, { // journey left to complete
                    "delay": 800,
                    "dashArray": [
                        10,
                        20
                    ],
                    "weight": 5,
                    "color": "#0000FF",
                    "pulseColor": "#FFFFFF",
                    "paused": false,
                    "reverse": false,
                    "hardwareAccelerated": true
                });
                map.addLayer(path2);
            }
            var fullRoute = route.concat(left);

            var grid = document.getElementById('journeyInfo-grid');
            var hc = document.getElementById('headCode');
            if (hc != 0) {
                hc.innerHTML = ("Head Code: " + headCode);
            }

            console.log(allMovementData);
            for (let i = 0; i < scheduleData.length; i++) {
                // route diagram code here
                item = allMovementData[i];
                scheduleItem = scheduleData[i];
                item = allMovementData.filter(data => data.tiploc == scheduleItem.tiploc && data.eventType == 'DEPARTURE');
                console.log(item);
                if (item.length > 0) { item = item[0]; }
                console.log('movement', item);
                console.log('schedule', scheduleItem);
                //time
                var elementDiv = document.createElement('div');
                elementDiv.classList.add('timeContainer');
                var element = document.createElement('p');
                // const planned = new Date(scheduleItem.planned);
                // element.innerHTML = planned.toLocaleTimeString();
                if (scheduleItem.hasOwnProperty('departure')) {
                    element.innerHTML = scheduleItem.departure;
                }
                else if (scheduleItem.hasOwnProperty('pass')) {
                    element.innerHTML = scheduleItem.pass;
                }
                else {
                    element.innerHTML = scheduleItem.arrival;
                }
                elementDiv.append(element);
                grid.append(elementDiv);

                //icons
                if (i == 0) { // origin station
                    var elementDiv = document.createElement('div');
                    elementDiv.classList.add('iconWrapper');
                    var element = document.createElement('span');
                    element.classList.add('iconify');
                    element.dataset.icon = 'material-symbols:line-end-circle-outline';
                    element.dataset.width = '75';
                    element.dataset.height = '75';
                    element.dataset.rotate = '270deg';
                    elementDiv.append(element);
                    grid.append(elementDiv);
                }
                else if (i == scheduleData.length - 1) { // destination station
                    console.log('here');
                    var elementDiv = document.createElement('div');
                    elementDiv.classList.add('iconWrapper');
                    var element = document.createElement('span');
                    element.classList.add('iconify');
                    element.dataset.icon = 'material-symbols:line-end-circle-outline';
                    element.dataset.width = '75';
                    element.dataset.height = '75';
                    element.dataset.rotate = '90deg';
                    elementDiv.append(element);
                    grid.append(elementDiv);
                }
                else { // other stations
                    var elementDiv = document.createElement('div');
                    elementDiv.classList.add('iconWrapper');
                    var element = document.createElement('span');
                    element.classList.add('iconify');
                    element.dataset.icon = 'mdi:horizontal-line';
                    element.dataset.width = '75';
                    element.dataset.height = '75';
                    element.dataset.rotate = '270deg';
                    elementDiv.append(element);
                    var element = document.createElement('span');
                    element.classList.add('iconify');
                    element.dataset.icon = 'material-symbols:line-end';
                    element.dataset.width = '75';
                    element.dataset.height = '75';
                    element.dataset.rotate = '270deg';
                    element.style.marginTop = '-30px';
                    elementDiv.append(element);
                    grid.append(elementDiv);
                }
                //station
                var elementDiv = document.createElement('div');
                elementDiv.classList.add('text-container');
                var element = document.createElement('p');
                if (item.hasOwnProperty('plannedDeparture') && item.hasOwnProperty('actualDeparture')) {
                    var timeDiff = calcTimeDiff(item.actualDeparture, item.plannedDeparture);
                    if (timeDiff > 0) {
                        element.innerHTML = (scheduleItem.location + "\n+ " + timeDiff + " min(s)");
                        elementDiv.append(element);
                        grid.append(elementDiv);
                    }
                    else {
                        element.innerHTML = (scheduleItem.location + " \nOn Time");
                        elementDiv.append(element);
                        grid.append(elementDiv);
                    }
                    //console.log(item.plannedDeparture + " " + item.actualDeparture + " diff: " + timeDiff);
                }
                else {
                    element.innerHTML = (scheduleItem.location);
                    elementDiv.append(element);
                    grid.append(elementDiv);
                }
            }
        })

    //Icon definitions
    var station = L.icon({
        iconUrl: '../assets/station.png',
        shadowUrl: '../assets/station.png',

        iconSize: [15, 10], // size of the icon
        shadowSize: [0, 0], // size of the shadow
        iconAnchor: [10, 5], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    var dot = L.icon({
        iconUrl: '../assets/dot.png',
        shadowUrl: '../assets/dot.png',
        iconSize: [7, 7], // size of the icon
        shadowSize: [0, 0], // size of the shadow
        iconAnchor: [3, 3], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    var train = L.icon({
        iconUrl: '../assets/train.png',
        shadowUrl: '../assets/train.png',
        iconSize: [24, 24], // size of the icon
        shadowSize: [0, 0], // size of the shadow
        iconAnchor: [12, 22], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor: [2, -20]
    })
    var locationIcon = L.icon({
        iconUrl: '../assets/location.png',
        shadowUrl: '../assets/location.png',
        iconSize: [24, 24], // size of the icon
        shadowSize: [0, 0], // size of the shadow
        iconAnchor: [12, 22], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor: [2, -20]
    })
}