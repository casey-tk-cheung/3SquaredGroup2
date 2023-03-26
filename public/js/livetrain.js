let journeytiplocs = fetch("./3SQUARED_Project/frontend/public/response.json")
    .then(r => r.json())
    .then(data => {
        // var line = L.polyline([data[20].latLong.latitude, data[20].latLong.longitude], [data[21].latLong.latitude, data[21].latLong.longitude]),
        //             animatedMarker = L.animatedMarker(line.getLatLngs());
    
        //         map.addLayer(animatedMarker);
        //         var animatedMarker = L.animatedMarker(line.getLatLngs(), {
        //             distance: 300,  // meters
        //             interval: 2000, // milliseconds
        //         });
        console.log([data[20].latLong.latitude, data[20].latLong.longitude], [data[21].latLong.latitude, data[21].latLong.longitude])
        var myMovingMarker = L.Marker.movingMarker([[data[0].latLong.latitude, data[0].latLong.longitude], [data[data.length - 1].latLong.latitude, data[data.length - 1].latLong.longitude]],
            [20000]).addTo(map);
        myMovingMarker.start();
            }
    )