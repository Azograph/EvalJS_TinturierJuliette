/***************
  MAP LEAFLET
***************/

// Création de la map, avec setView on définit la position et le zoom.
let map = L.map('map').setView([0, 0], 5);

// On définit un titre, le zoom maximum
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 30,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// On créer une extension de la classe L.Icon sur laquelle :
// On définit les options de l'icon (Size = taille, Anchor = le décalage).
const iss_icon = L.Icon.extend({
    options: {
        iconSize:     [50, 50],
        iconAnchor:   [22, 94],
    }
});

// Ici, on va créer une instance de notre classe dans laquelle on va pouvoir définir l'image de l'icon .
const icon = new iss_icon ({
  iconUrl: './assets/img/international-space-station-icon.png'
});

// La constante marker nous permet de créer l'icon sur notre map.
const marker = L.marker([0,0], {icon: icon}).addTo(map);

/*******************
  SUIVI ISS
*******************/

// async va perpermttre de signaler que la fonction va avoir un timming particulier.
// await un peu plus tard demandera d'attentendre la réponse.
async function issAPI (map, marker) {
  try {
    // La constante data va récupérer toutes les données de l'api.
  const data = await fetch ('http://api.open-notify.org/iss-now.json');
  console.log(data); 

  // Vérification du statut de la réponse
  if (!data.ok || data.status !== 200) {  // Vérification du statut 200
    console.error("Erreur lors de la récupération des données : ", data.statusText);
    return; // Sortir de la fonction si la réponse n'est pas OK
  }
  // Ici on va transformer la réponse pour qu'elle devienne un objet js (dans la const dataTransformed).
  const dataTransformed = await  data.json();
  console.log(dataTransformed); // Vérification dans la console que les données sont bien transformées.

  // On va chercher la valeur de "latitude" et la stoker dans un variable
  let latitude = dataTransformed.iss_position.latitude;
  console.log(latitude);
  // On va chercher la valeur de "longitude" et la stoker dans un variable
  let longitude = dataTransformed.iss_position.longitude;
  console.log(longitude);

  // On utilise les valeurs stocker de longitude et latitude pour changer la position de la vue de la map et du marker.
  map.setView([latitude, longitude]);
  marker.setLatLng([latitude,longitude]);

  } catch (error) {
    console.error("Erreur lors de l'appel à l'API : ", error);
  }
}

//On appel la fonction issAPI toute les 1000ms
setInterval(()=> {
  issAPI(map,marker)
}, 1000);
  


/***************
  METEO LOCALE
***************/

