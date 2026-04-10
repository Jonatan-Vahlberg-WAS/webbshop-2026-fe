import { map } from "../utils/map.js";

import { getBaseUrl } from "../utils/api.js";

console.log("map_page.js is running");

const BASE_URL = getBaseUrl();

// simulate login (can be null)
const currentUser = localStorage.getItem("user");

// load plants
async function loadPlants() {
  try {
    const res = await fetch(`${BASE_URL}plants`);
    const plants = await res.json();

    console.log("PLANTS:", plants);

    plants.forEach((plant, index) => {
      // ❗ safety check
      if (!plant.coordinates) return;

      const lat = plant.coordinates[0];
      const lng = plant.coordinates[1];

      const marker = L.marker([lat, lng]).addTo(map);

      // ❗ FIXED fields from backend
      const isOwner = plant.ownerId === currentUser;

      marker.bindPopup(
        `
        <div class="popup-content">
          <h3>${plant.plantName}</h3>
          <p>${plant.description || ""}</p>
          <p>Ljusnivå: ${plant.light ?? "-"}</p>
          <p>Ägs av: ${plant.ownerId || "Okänd"}</p>

          <img src="${plant.imageUrl}" class="popup-img" />

          ${
            isOwner
              ? `
                <button class="edit-btn">Redigera</button>
                <button class="delete-btn">Ta bort</button>
              `
              : `
                <button class="trade-btn">Begär byte</button>

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

      // focus first marker
      if (index === 0) {
        marker.openPopup();
        map.setView([lat - 0.01, lng], 15);
      }
    });

  } catch (error) {
    console.error("Error loading plants:", error);
  }
}

loadPlants();


// popup interactions
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