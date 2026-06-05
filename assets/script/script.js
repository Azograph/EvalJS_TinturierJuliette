/***************
  MAP LEAFLET
***************/

// Création de la map, avec setView on définit la position et le zoom.
let map = L.map('map').setView([0, 0], 5);

// On définit un titre, le zoom maximum.
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

// Ici, on va créer une instance de notre classe dans laquelle on va pouvoir définir l'image de l'icon.
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

  // Vérification du statut de la réponse.
  if (!data.ok || data.status !== 200) {  // Vérification du statut 200.
    console.error("Erreur lors de la récupération des données : ", data.statusText);
    return; // Sortir de la fonction si la réponse n'est pas OK.
  }
  // Ici on va transformer la réponse pour qu'elle devienne un objet js (dans la const dataTransformed).
  const dataTransformed = await  data.json();
  console.log(dataTransformed); // Vérification dans la console que les données sont bien transformées.

  // On va chercher la valeur de "latitude" et la stoker dans un variable.
  let latitude = dataTransformed.iss_position.latitude;
  console.log(latitude);
  // On va chercher la valeur de "longitude" et la stoker dans un variable.
  let longitude = dataTransformed.iss_position.longitude;
  console.log(longitude);

  // On utilise les valeurs stocker de longitude et latitude pour changer la position de la vue de la map et du marker.
  map.setView([latitude, longitude]);
  marker.setLatLng([latitude,longitude]);

  } catch (error) {
    console.error("Erreur lors de l'appel à l'API : ", error);
  }
}

// On appel la fonction issAPI toute les 1000ms.
setInterval(()=> {
  issAPI(map,marker)
}, 1000);
  


/***************
  METEO LOCALE
***************/
// On récupère l'élément cardMeteo.
cardMeteo = document.querySelector('.cardMeteo');
// On va chercher l'element button de notre html.
const buttun = document.querySelector('button');

// On créer un paragraphe
const paragraphe = document.createElement('p');

// On applique du css au paragraphe.
paragraphe.style.height ='300px';
paragraphe.style.width ='200px';
paragraphe.style.margin='16px 0px 16px 0px';
paragraphe.style.border = '3px solid grey';
paragraphe.style.padding = "16px 12px 24px 12px";

// On position le paragraphe dans le html.
cardMeteo.insertBefore(paragraphe,buttun);

// L'élément html est rempli par text.
function addInfo (element,text) {
  element.innerText=text;
}

// On va chercher les information météo de l'api.
async function meteoAPI() {
    try {
    // La constante data va récupérer toutes les données de l'api.
  const dataM = await fetch ('https://prevision-meteo.ch/services/json/toulouse');
  console.log(dataM); 

  // Vérification du statut de la réponse.
  if (!dataM.ok || dataM.status !== 200) {  // Vérification du statut 200.
    console.error("Erreur lors de la récupération des données : ", dataM.statusText);
    return; // Sortir de la fonction si la réponse n'est pas OK.
  }
  // Ici on va transformer la réponse pour qu'elle devienne un objet js (dans la const dataTransformed).
  const dataMTransformed = await  dataM.json();
  console.log(dataMTransformed); // Vérification dans la console que les données sont bien transformées.

  // Ici on va plusieurs fois créer une variable qui récupère une donnée transformée de l'api et la vérifier dans la console.
  const condition = dataMTransformed.current_condition.condition; // Récupération des données transformées.
  console.log(condition); // Vérification dans la console.
  const temperature = dataMTransformed.current_condition.tmp;
  console.log(temperature); 
  const tmax = dataMTransformed.fcst_day_0.tmax;
  console.log(tmax); 
  const tmin = dataMTransformed.fcst_day_0.tmin;
  console.log(tmin); 

  // On créer le texte avec une chaine de caractère et en ajoutant les variables qu'on vient de créer.
  let text = `Aujourd'hui le temps est : ${condition}, et la températures est de ${temperature}°C 
  T° Max = ${tmax} - T° Min= ${tmin}`;

  // On appel la fonction qui va remplir le paragraphe en fonction des données récupérées.
  addInfo(paragraphe, text);

  } catch (error) {
    console.error("Erreur lors de l'appel à l'API : ", error);
  }
}



// On créer un evenement au click qui appelle les fonctions créer si dessus.
buttun.addEventListener ('click', () => {
  meteoAPI();
})