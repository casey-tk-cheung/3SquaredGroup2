var container = document.getElementById('tiplocMenu');

function getTiplocs(){
    var alltiplocs = [];
    let gettiplocs = fetch("./tiplocs.json")
        .then(r => r.json())
        .then(data => {
            for (const item of data) {
                if (!alltiplocs.includes(item.originTiploc)){
                    if (item.originTiploc){
                        var p = document.createElement('p');
                        p.innerHTML = item.originLocation;
                        p.id = item.originTiploc;
                        p.addEventListener("click", getJourneys);
                        p.classList.add('menuOptions');
                        container.append(p);
                    }
                    alltiplocs.push(item.originTiploc);
                }
            }
        })
}

getTiplocs();