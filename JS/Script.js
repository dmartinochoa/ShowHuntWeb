let resultsList = document.querySelector('#results');
let citySearch = document.querySelector('#cityTextArea');
let searchBtn = document.querySelector('#searchBtn');
let bandSearch = document.querySelector('#bandNameTextArea');
let count = 0;

function btnEnabler() {
    if (bandSearch.value.length > 0) {
        searchBtn.disabled = false;
        searchBtn.className = "button";
    } else {
        searchBtn.disabled = true;
        searchBtn.className = "buttondis"
    }
}

function enterSearch() {
    let key = event.keyCode;
    if (key === 13) {
        fetchData();
    }
}

function fetchData() {
    let countryCode = document.querySelector('#country').value;
    let artist = bandSearch.value;
    if (artist !== "") {
        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?&countryCode=" + countryCode + "&sort'date,asc'&keyword=" +
            artist + "&apikey=UPZ5QoSaUAQ8kBvUZD6s3X7HT9z3p2wl";
        var request = new XMLHttpRequest();
        request.open('GET', queryURL);
        request.responseType = 'json';
        request.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const response = request.response;
                addShow(response);
            }
        };
        request.send();
        bandSearch.value = "";
    }
}

function addShow(response) {
    resultsList.innerHTML = ``;
    if (response.hasOwnProperty('_embedded')) {
        let evts = response._embedded.events;
        for (let i = 0; i < evts.length; i++) {
            let tourName = evts[i].name;
            let tourDate = evts[i].dates.start.localDate;
            let tourTime = evts[i].dates.start.localTime;
            let venue = evts[i]._embedded.venues[0].name;
            let showCity = evts[i]._embedded.venues[0].city.name;
            let buyLink = evts[i].url;
            let imageLink = evts[i].images[0].url;
            let city = citySearch.value.trim().toLowerCase();
            //localtime puede devolver undefined asique formatear la fecha dara error sin la comprobacion
            if (tourTime != undefined) {
                tourTime = tourTime.substring(0, 5);
            }
            if (city === "" || showCity.toLowerCase() === city) {
                count++;
                resultsList.innerHTML += `
                 <li class="resultLi">
                     <div class="row">
                        <div class="col-12 col-md-4 d-flex flex-wrap align-items-center pipoEsUnBuenPerro">
                            <a href=${buyLink}> <img class="bandImage" src="${imageLink}" alt="Artis Image"></a>
                        </div>
                        <div class="col-12 col-md-8 d-flex resultInfo ">
                            <div class="showInfo">
                                <div class="nameAndDate">
                                    <span class="tourName">${tourName}</span>
                                    <br>
                                    <span class="tourDate">${tourDate}</span> 
                                </div>
                            <div class="details">
                                <span class="tourTime">${tourTime} - </span>
                                <span class="venue">${venue}</span>
                                <br>
                                <span class="showCity">${showCity}</span>
                            </div>
                            <div class="buyTickets">
                            <a class="buyLink" href="${buyLink}">Buy Tickets <i class="fas fa-external-link-alt"></i></a>   
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            <hr class= "hr">`;
            }
        }
        citySearch.value = "";
    }
    concertCounter();
    btnEnabler()
    count = 0;
}

function concertCounter() {
    let showCount = document.querySelector("#counter");
    if (count != 1) {
        showCount.innerHTML = `${count} concerts found`
    } else {
        showCount.innerHTML = `${count} concert found`
    }
}