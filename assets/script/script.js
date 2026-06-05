/***************
  MAP LEAFLET
***************/
let map = L.map('map').setView([0, 0], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 30,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const iss_icon = L.Icon.extend({
    options: {
        iconSize:     [50, 50],
        iconAnchor:   [22, 94],
    }
});

let icon = new iss_icon ({
  iconUrl: './assets/img/international-space-station-icon.png'
});

let marker = L.marker([0,0], {icon: icon}).addTo(map);


/*******************
  SUIVI ISS
*******************/


/***************
  METEO LOCALE
***************/