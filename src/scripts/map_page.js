import { map } from "../utils/map.js";

const plants = JSON.parse(localStorage.getItem("plants")) || [];

console.log(plants); 

plants.forEach((plant) => {
  const lat = 59.3293; // TEMP (Stockholm)
  const lng = 18.0686;

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`
      <div>
        <h3>${plant.name}</h3>
        <p>${plant.location}</p>
        <p>Ljusnivå: ${plant.light}</p>
        <img src="${plant.image}" width="100" />
        <button>Begär</button>
      </div>
    `);



});

map.setView([59.3293, 18.0686], 11);
