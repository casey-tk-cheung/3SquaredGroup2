var tiplocSearch = document.getElementById('tiplocSearch');
tiplocSearch.addEventListener('input', filterTiplocs);

function expandMenu(e) {
    closeSecondMenu();
    var secondMenu = document.getElementById('secondMenu');
    secondMenu.style.display = 'inline';
    var tiploc = e.currentTarget.id;
    var date = new Date().toISOString();
    date = date.substring(0, date.length - 14);
    fetch(`API/Tiplocs/${tiploc}`)
        .then(res => res.json())
        .then(data => {
            data = data.data
            var container = document.getElementById('secondMenuItems');
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

function closeSecondMenu() {
    secondMenu.style.display = 'none';
    var secondMenuContainer = document.getElementById('secondMenuItems')
    secondMenuContainer.replaceChildren();
}

function journeyClicked(e) {
    closeSecondMenu();
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
    var container = document.getElementById('menuItems').replaceChildren();
    var container = document.getElementById('menuItems');
    if (query != ''){
        let gettiplocs = fetch("3SQUARED_Project/frontend/tiplocs.json")
            .then(r => r.json())
            .then(data => {
                for (const item of data) {
                    if (item.originLocation.toLowerCase().includes(query.toLowerCase()))
                    {
                    var p = document.createElement('p');
                    p.innerHTML = item.originLocation;
                    p.id = item.originTiploc;
                    p.addEventListener("click", expandMenu);
                    p.classList.add('menuOptions');
                    container.append(p);
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
                    p.addEventListener("click", expandMenu);
                    p.classList.add('menuOptions');
                    container.append(p);
                }
            }
            )
    }
}