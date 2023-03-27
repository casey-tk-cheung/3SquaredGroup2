var tiplocSearch = document.getElementById('tiplocSearch');
tiplocSearch.addEventListener('input', filterTiplocs);

function getJourneys(e) {
    clearSidebar();
    var secondMenu = document.getElementById('journeyMenu');
    secondMenu.style.display = 'inline';
    const headers = new Headers();
    headers.append('X-ApiKey', 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A');
    headers.append('X-ApiVersion', '1');
    var tiploc = e.currentTarget.id;
    var date = new Date().toISOString();
    date = date.substring(0, date.length - 14);
    fetch(`https://traindata-stag-api.railsmart.io/api/trains/tiploc/${tiploc}/${date} 00:00:00/${date} 23:59:59`, { headers: headers })
        .then(res => res.json())
        .then(data => {
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
                p.style.fontSize = '14px';
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
}

function resetSidebar(){
    clearSidebar();
    tiplocMenu.style.display = 'inline';
    tiplocSearch.value = "";
}

function journeyClicked(e) {
    clearSidebar();
    map.eachLayer(function (layer) {
        if (layer != Location.tileLayer) {
            map.removeLayer(layer);
        }
    })
    addTileLayer();
    route(e);
}

function filterTiplocs(){
    var query = tiplocSearch.value;
    console.log(query);
    var container = document.getElementById('tiplocMenu').replaceChildren();
    var container = document.getElementById('tiplocMenu');  
    if (query != ''){
        let gettiplocs = fetch("tiplocs.json")
            .then(r => r.json())
            .then(data => {
                for (const item of data) {
                    if (item.originLocation){
                        if (item.originLocation.toLowerCase().includes(query.toLowerCase()))
                        {
                            var p = document.createElement('p');
                            p.innerHTML = item.originLocation;
                            p.id = item.originTiploc;
                            p.addEventListener("click", getJourneys);
                            p.classList.add('menuOptions');
                            container.append(p);
                        }
                    }
                }
            }
        )
    }
    else {
        let gettiplocs = fetch("tiplocs.json")
            .then(r => r.json())
            .then(data => {
                for (const item of data) {
                    var p = document.createElement('p');
                    p.innerHTML = item.originLocation;
                    p.id = item.originTiploc;
                    p.addEventListener("click", journeyClicked);
                    p.classList.add('menuOptions');
                    container.append(p);
                }
            }
            )
    }
}
var keyBtn = L.DonUtil.get('keyBtn');

L.DomEvent.on(keyBtn, 'click', function(){
    //Do something with click event
});