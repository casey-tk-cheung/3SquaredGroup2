var tiplocSearch = document.getElementById('tiplocSearch');
tiplocSearch.addEventListener('input', filterTiplocs);

var interval;
var intervalBegan = false;

var toggleTiploc = document.getElementById('tiplocBtn');
toggleTiploc.addEventListener('click', journeyClicked);

var storedJourney = [];

function getJourneys(e) {
    storedJourney = [];
    clearSidebar();
    var secondMenu = document.getElementById('journeyMenu');
    secondMenu.style.display = 'inline';
    var tiploc = e.currentTarget.id;
    var date = new Date().toISOString();
    date = date.substring(0, date.length - 14);
    fetch(`API/Tiplocs/${tiploc}`)
        .then(res => res.json())
        .then(data => {
            data = data.data;
            var container = document.getElementById('journeyMenu');
            var resultsCount = document.createElement('p');
            resultsCount.innerHTML = `${data.length} trains today`;
            resultsCount.style.fontSize = '14px';
            resultsCount.style.textAlign = 'center';
            resultsCount.style.color = '#808080';
            container.append(resultsCount);
            for (const item of data) {
                var p = document.createElement('p');
                p.innerHTML = item.originLocation + ' - ' + item.destinationLocation;
                p.activationId = item.activationId;
                p.scheduleId = item.scheduleId;
                p.headCode = item.headCode;
                p.destinationLocation = item.destinationLocation;
                p.originLocation = item.originLocation;
                p.scheduledDeparture = item.scheduledDeparture;
                p.style.fontSize = '14px';
                if (item.cancelled == true) { p.style.color = 'red' }
                p.addEventListener("click", journeyClicked);
                p.classList.add('menuOptions');
                container.append(p);
            }
        })
}

function clearSidebar() {
    var tiplocMenu = document.getElementById('tiplocMenu');
    tiplocMenu.style.display = 'none';
    var journeyMenu = document.getElementById('journeyMenu');
    journeyMenu.replaceChildren();
    var journeyInfoGrid = document.getElementById('journeyInfo-grid');
    journeyInfoGrid.replaceChildren();
}

function resetSidebar() {
    clearSidebar();
    tiplocMenu.style.display = 'inline';
    var b = document.getElementById("tiplocBtn");
    b.style.visibility = 'hidden';
    var journeyInfo = document.getElementById("journeyInfo");
    journeyInfo.style.visibility = 'hidden';
}

function journeyClicked(e) {
    clearSidebar();
    var journeyInfo = document.getElementById('journeyInfo');
    journeyInfo.style.visibility = 'visible';
    storedJourney.push(e);
    route(storedJourney[0]);

    map.eachLayer(function (layer) {
        if (layer != Location.tileLayer) {
            map.removeLayer(layer);
        }
    })
    for(i in storedJourney){i + console.log(storedJourney[i]);}
    addTileLayer();
 
    newJourney();
    intervalBegan = true;
    if (intervalBegan) {clearInterval(interval); }
    interval = setInterval(() => {
        route(storedJourney[0]);
        map.eachLayer(function (layer) {
            if (layer != Location.tileLayer) {
                map.removeLayer(layer);
            }
        })
        addTileLayer();
    }, 20000);
    var b = document.getElementById("tiplocBtn");
    b.style.visibility = 'visible';
    var journeyInfo = document.getElementById("journeyInfo");
    journeyInfo.style.visibility = 'visible';
}

function filterTiplocs() {
    var alltiplocs = []
    var query = tiplocSearch.value;
    var container = document.getElementById('tiplocMenu').replaceChildren();
    var container = document.getElementById('tiplocMenu');
    if (query != '') {
        let gettiplocs = fetch("../tiplocs.json")
            .then(r => r.json())
            .then(data => {
                for (const item of data) {
                    if (!alltiplocs.includes(item.originTiploc)) {
                        if (item.originLocation) {
                            if (item.originLocation.toLowerCase().includes(query.toLowerCase())) {
                                var p = document.createElement('p');
                                p.innerHTML = item.originLocation;
                                p.id = item.originTiploc;
                                p.addEventListener("click", getJourneys);
                                p.classList.add('menuOptions');
                                container.append(p);
                            }
                        }
                        alltiplocs.push(item.originTiploc);
                    }
                }
            }
            )
    }
    else {
        getTiplocs();
    }
}

function toggleKey() {
    var b = document.getElementById("keyBtn");
    var s = document.getElementById("markersInfo");
    if (b.innerHTML == 'Show Key') {
        s.style.visibility = 'visible';
        b.innerHTML = 'Hide Key'
    }
    else {
        s.style.visibility = 'hidden';
        b.innerHTML = 'Show Key';
    }
}

function tiplocBtnClick() {
    var b = document.getElementById("tiplocBtn")
    if (b.innerHTML == "Show all TIPLOCs") {
        filterTiplocs();
        b.innerHTML = "Hide Station Passes";
    }
    else {
        b.innerHTML = "Show all TIPLOCs";
        filterTiplocs();
    }
}


function calcTimeDiff(realTime, schedTime) {
    const schedDate = new Date(schedTime);
    const realDate = new Date(realTime);
    const diffInMs = Math.abs(realDate - schedDate);
    const diffInMin = Math.floor(diffInMs / 1000 / 60);
    return diffInMin;
}

function clearSearch() {
    var search = document.getElementById('tiplocSearch');
    search.value = '';
    filterTiplocs();
}