//var toggleTiplocs = document.getElementById('tiplocBtn');
//toggleTiplocs.addEventListener('click', route);

async function route(e) {
    //changed instances of 'e.currentTarget' to 'e.explicitOriginalTarget' to facilitate reloading
    console.log(e.explicitOriginalTarget); 
    var activationId = e.explicitOriginalTarget.activationId;
    var scheduleId = e.explicitOriginalTarget.scheduleId;
    var headCode = e.explicitOriginalTarget.headCode;
    var destinationLocation = e.explicitOriginalTarget.destinationLocation;
    var originLocation = e.explicitOriginalTarget.originLocation;
    var route = [];
    var left = [];
    var passGroup = new L.layerGroup();
    const headers = new Headers();
    headers.append('X-ApiKey', 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A');
    headers.append('X-ApiVersion', '1');

    var lastVisitedTiploc;
    await fetch('https://traindata-stag-api.railsmart.io/api/ifmtrains/movement/' 
    + activationId + '/' + scheduleId, { headers: headers })
        .then(response => response.json())
        .then(data => {
            if (data.length != 0)
            lastVisitedTiploc = data[data.length - 1].tiploc;
            else lastVisitedTiploc = 0;
        })
    fetch('https://traindata-stag-api.railsmart.io/api/ifmtrains/schedule/' + activationId + '/' + scheduleId, {headers: headers})
        .then(response => response.json())
        .then(data => {
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
                        .bindPopup(item.location);
                }
                //Create all other markers, if showing all station passes is enabled via button
                if (item.hasOwnProperty('latLong') && item.hasOwnProperty('pass') && btn.innerHTML == "Hide Station Passes" &&
                 (item != data[0] && item != data[data.length[-1]])) {
                    var marker = new L.marker([item.latLong.latitude, item.latLong.longitude], { icon: dot})
                        .addTo(passGroup)
                        .bindPopup(item.location);
                }
            }
            map.addLayer(passGroup); //Add pass markers to layer group
            var fullRoute = route.concat(left);
            new L.marker(route[0]).bindPopup(data[0].location).addTo(map);  //Journey starting marker
            new L.marker(left[left.length - 1]).bindPopup(data[data.length - 1].location).addTo(map); //Journey termination marker
            new L.marker(left[0], {icon: train}).bindPopup(headCode + '  ||  ' + originLocation + ' - ' + destinationLocation).addTo(map); //Train marker
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

    //Icon definitions
    var station = L.icon({
        iconUrl: '../assets/station.png',
        shadowUrl: '../assets/station.png',

        iconSize: [20, 13], // size of the icon
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
        iconAnchor: [10, 25], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor: [2, -20],
        forceZIndex: [400]
    })
}