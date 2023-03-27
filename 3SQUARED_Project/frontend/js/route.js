async function route(e) {
    var activationId = e.currentTarget.activationId;
    var scheduleId = e.currentTarget.scheduleId;
    var route = [];
    var left = [];
    const headers = new Headers();
    headers.append('X-ApiKey', 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A');
    headers.append('X-ApiVersion', '1');

    console.log('https://traindata-stag-api.railsmart.io/api/ifmtrains/movement/' + e.currentTarget.activationId + '/' + e.currentTarget.scheduleId);
    var lastVisitedTiploc;
    await fetch(`/API/Movements/${activationId}/${scheduleId}`)
        .then(response => response.json())
        .then(data => {
            data = data.data
            if (data.length != 0)
            lastVisitedTiploc = data[data.length - 1].tiploc;
            else lastVisitedTiploc = 0;
        })
    fetch(`/API/Schedule/${activationId}/${scheduleId}`)
        .then(response => response.json())
        .then(data => {
            data = data.data
            while (!data[data.length - 1].hasOwnProperty('latLong')) data.pop()
            var completedJourney = true;
            console.log(data);
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
                    var marker = new L.marker([item.latLong.latitude, item.latLong.longitude], { icon: station })
                        .addTo(map)
                        .bindPopup(item.location);
                }

            }
            var fullRoute = route.concat(left);
            // var movingMarker = L.Marker.movingMarker([route[0], left[left.length - 1]],
            //     [5000]).addTo(map);
            // movingMarker.start();
            console.log(fullRoute);
            new L.marker(route[0]).bindPopup(data[0].location).addTo(map);
            new L.marker(left[0], {icon: train}).bindPopup('Last updated location').addTo(map);
            new L.marker(left[left.length - 1]).bindPopup(data[data.length - 1].location).addTo(map);
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

        iconSize: [20, 13], // size of the icon
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
        iconAnchor: [10, 25], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor: [2, -20],
        forceZIndex: [400]
    })
    // map.fitBounds(path);
}