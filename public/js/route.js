async function route(e) {
    var activationId = e.currentTarget.activationId;
    var scheduleId = e.currentTarget.scheduleId;
    var headCode = e.currentTarget.headCode;
    var destinationLocation = e.currentTarget.destinationLocation;
    var originLocation = e.currentTarget.originLocation;
    var scheduledDeparture = e.currentTarget.scheduledDeparture;
    var route = [];
    var left = [];
    const headers = new Headers();
    headers.append('X-ApiKey', 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A');
    headers.append('X-ApiVersion', '1');

    var allMovementData;
    var lastVisitedTiploc;
    await fetch('https://traindata-stag-api.railsmart.io/api/ifmtrains/movement/' + e.currentTarget.activationId + '/' + e.currentTarget.scheduleId, { headers: headers })
        .then(response => response.json())
        .then(data => {
            allMovementData = data;
            if (data.length != 0)
            lastVisitedTiploc = data[data.length - 1].tiploc;
            else lastVisitedTiploc = 0;
        })

    fetch('https://traindata-stag-api.railsmart.io/api/ifmtrains/schedule/' + activationId + '/' + scheduleId, {headers: headers})
        .then(response => response.json())
        .then(data => {
            console.log(data);
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
                if (item.hasOwnProperty('latLong') && item.hasOwnProperty('departure') && (item != data[0] && item != data[data.length[-1]])) {
                    var marker = new L.marker([item.latLong.latitude, item.latLong.longitude], { icon: station})
                        .addTo(map)
                        .bindPopup(item.location);
                }

            }
            var fullRoute = route.concat(left);
            var grid = document.getElementById('journeyInfo-grid');
            var hc = document.getElementById('headCode');
            if(hc != 0){
                 hc.innerHTML = ("Head Code: " + headCode);
            }
            var firstStation = document.getElementById('originStation');
            console.log(allMovementData[0]);

            

            if( firstStation !=0){
                firstStation.innerHTML = (originLocation);
                if (allMovementData[0].actualDeparture != 0){
                    var dep = new Date(allMovementData[0].actualDeparture);
                    dep = dep.toLocaleTimeString();
                    firstStation.innerHTML = (originLocation + "\nDeparted: " + dep);
                }
            }
            var lastStation = document.getElementById('destinationStation')
            if( lastStation != 0){
                lastStation.innerHTML = (destinationLocation);
                if(allMovementData[0].plannedArrival != 0){
                    var arv = new Date(allMovementData[0].plannedArrival);
                    arv = arv.toLocaleTimeString();
                    lastStation.innerHTML = (destinationLocation + "\nExp Arrival: " +arv);
                }
            }
            allMovementData.forEach(item => {
                // route diagram code here

                var elementDiv = document.createElement('div');
                elementDiv.classList.add('timeContainer');
                var element = document.createElement('p');
                const planned = new Date(item.plannedArrival);
                element.innerHTML = planned.toLocaleTimeString();
                elementDiv.append(element);
                grid.append(elementDiv);

                var elementDiv = document.createElement('div');
                elementDiv.classList.add('iconWrapper');
                var element = document.createElement('span');
                element.classList.add('iconify');
                element.dataset.icon = 'material-symbols:line-end';
                element.dataset.width = '75';
                element.dataset.height = '75';
                element.dataset.rotate = '270deg';
                elementDiv.append(element);
                grid.append(elementDiv);
            })

            
            var marker1 = new L.marker(left[0], {icon: train}).bindPopup(headCode + '  ||  ' + originLocation + ' - ' + destinationLocation).addTo(map);
            marker1.setZIndexOffset(1000);
            new L.marker(route[0], {icon: locationIcon}).bindPopup(data[0].location).addTo(map);
            new L.marker(left[left.length - 1],{icon: locationIcon}).bindPopup(data[data.length - 1].location).addTo(map);
            if (route.length != 0){
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
            if (left.length != 0){
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
        })

    var station = L.icon({
        iconUrl: '../assets/station.png',
        shadowUrl: '../assets/station.png',

        iconSize: [15, 10], // size of the icon
        shadowSize: [0, 0], // size of the shadow
        iconAnchor: [10, 5], // point of the icon which will correspond to marker's location
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