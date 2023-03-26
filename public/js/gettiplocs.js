var container = document.getElementById('menuItems');

let gettiplocs = fetch("./tiplocs.json")
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