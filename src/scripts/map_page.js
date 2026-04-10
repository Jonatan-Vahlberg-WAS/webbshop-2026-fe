import { map } from "../utils/map.js";

import { getBaseUrl } from "../utils/api.js";

const BASE_URL = getBaseUrl();

async function loadPlants() {
  const res = await fetch(`${BASE_URL}plants`);
  const plants = await res.json();

  console.log("PLANTS:", plants);

  plants.forEach((plant) => {
    const lat = 59.33;
    const lng = 18.06;

    L.marker([lat, lng]).addTo(map);
  });
}

loadPlants();