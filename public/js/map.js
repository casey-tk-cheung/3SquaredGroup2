//map initialization
// Initialize a map centered at (53, 12) at zoom level 5
var map = L.map('map').setView([52.4710531, -2.4481026], 6.69);

// Style URL format in XYZ PNG format; see our documentation for more options
function addTileLayer(){
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        maxZoom: 13,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(map);
}

addTileLayer();
//map.addLayer(addTileLayer());