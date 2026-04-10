import { map } from "../utils/map.js";

import { getBaseUrl } from "../utils/api.js";

console.log("map_page.js is running");

const BASE_URL = getBaseUrl();

// 👇 simulate login (can be null)
const currentUser = localStorage.getItem("user");

// load plants
async function loadPlants() {
  const res = await fetch(`${BASE_URL}plants`);
  const plants = await res.json();

  console.log("PLANTS:", plants);

  plants.forEach((plant, index) => {
    const lat = 59.33;
    const lng = 18.06;

    const marker = L.marker([lat, lng]).addTo(map);

    const isOwner = plant.owner === currentUser;

    marker.bindPopup(
      `
      <div class="popup-content">
        <h3>${plant.name}</h3>
        <p>${plant.location}</p>
        <p>Ljusnivå: ${plant.light}</p>
        <p>Ägs av: ${plant.owner || "Okänd"}</p>

        <img src="${plant.image}" class="popup-img" />

        ${
          isOwner
            ? `
              <button class="edit-btn">Redigera</button>
              <button class="delete-btn">Ta bort</button>
            `
            : `
              <button class="trade-btn">
                Begär byte
              </button>

              ${
                !currentUser
                  ? `
                  <p class="login-msg">
                    <a href="/login.html" class="login-link">
                      Klicka här för att logga in
                    </a>
                  </p>
                  `
                  : ""
              }
            `
        }
      </div>
      `,
      {
        maxWidth: 200,
        minWidth: 150
      }
    );

    if (index === 0) {
      marker.openPopup();
      map.setView([lat - 0.01, lng], 15);
    }
  });
}

loadPlants();

// popup interactions (simple)
map.on("popupopen", (e) => {
  const popup = e.popup._contentNode;

  const tradeBtn = popup.querySelector(".trade-btn");
  const editBtn = popup.querySelector(".edit-btn");
  const deleteBtn = popup.querySelector(".delete-btn");

  if (tradeBtn) {
  if (!currentUser) {
    tradeBtn.disabled = true;
  } else {
    tradeBtn.onclick = () => {
      console.log("Trade request (future feature)");
    };
  }
}

 
  if (editBtn) {
    editBtn.onclick = () => {
      alert("Edit kommer senare");
    };
  }

  if (deleteBtn) {
    deleteBtn.onclick = () => {
      alert("Delete kommer senare");
    };
  }
});