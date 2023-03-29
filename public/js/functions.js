var tiplocSearch = document.getElementById('tiplocSearch');
tiplocSearch.addEventListener('input', filterTiplocs);

function getJourneys(e) {
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
                p.style.fontSize = '14px';
                if (item.cancelled == true) {p.style.color = 'red';}
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
    // tiplocSearch.value = "";
    var b = document.getElementById("tiplocBtn");
    b.style.visibility = 'hidden';
}

function journeyClicked(e) {
    //clearSidebar();
    console.log(e);
    var activationId = e.currentTarget.activationId;
    var scheduleId = e.currentTarget.scheduleId;
    fetch(`API/writeE/${activationId}/${scheduleId}`)
    .then((res => res.json()))
    .then((data) =>
    {
        console.log(data)
    })
    map.eachLayer(function (layer) {
        if (layer != Location.tileLayer) {
            map.removeLayer(layer);
        }
    })
    addTileLayer();
    route(activationId, scheduleId);
   // getMovementUpdates(activationId, scheduleId);
    fetch(`API/Movements_updates/` + e.currentTarget.activationId + `/` + e.currentTarget.scheduleId )
    .then(response => response.json())
    .then(data => {
        //console.log(data)
        data = data.data
       // fs.writeFileSync('./public/tiplocs.json', JSON.stringify(workingTiplocs, null, 2), {encoding:'utf8',flag:'w'})
        console.log('run')
    })
    var b = document.getElementById("tiplocBtn");
    b.style.visibility = 'visible';
}

function filterTiplocs(){
    var alltiplocs = []
    var query = tiplocSearch.value;
    var container = document.getElementById('tiplocMenu').replaceChildren();
    var container = document.getElementById('tiplocMenu');  
    if (query != ''){
        let gettiplocs = fetch("../tiplocs.json")
            .then(r => r.json())
            .then(data => {
                for (const item of data) {
                    if (!alltiplocs.includes(item.originTiploc))
                    {
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
// var keyBtn = L.DonUtil.get('keyBtn');

// L.DomEvent.on(keyBtn, 'click', function(){
    
// });
function toggleKey(){
    var b = document.getElementById("keyBtn");
    var s = document.getElementById("markersInfo");
    if(b.innerHTML == 'Show Key'){
        s.style.visibility = 'visible';
        b.innerHTML = 'Hide Key'
    }
    else{
        s.style.visibility = 'hidden';
        b.innerHTML = 'Show Key';
    }
}
function tiplocBtnClick(){
    var b = document.getElementById("tiplocBtn")
    if(b.innerHTML == "Show all Tiplocs"){
        b.innerHTML = "Hide all Tiplocs";
    }
    else{
        b.innerHTML = "Show all Tiplocs";
    }
}