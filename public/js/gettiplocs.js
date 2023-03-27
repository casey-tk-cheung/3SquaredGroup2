var container = document.getElementById('tiplocMenu');

let gettiplocs = fetch("./tiplocs.json")
    .then(r => r.json())
    .then(data => {
        for (const item of data) {
            if (item.originTiploc){
                var p = document.createElement('p');
                p.innerHTML = item.originLocation;
                p.id = item.originTiploc;
                p.addEventListener("click", getJourneys);
                p.classList.add('menuOptions');
                container.append(p);
            }
        }
        }
    )