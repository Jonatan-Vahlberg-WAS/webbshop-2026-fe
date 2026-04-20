import { map } from "../utils/map.js";

import { getBaseUrl } from "../utils/api.js";

console.log("map_page.js is running");

const BASE_URL = getBaseUrl();

// simulate login (can be null)
/* const currentUser = localStorage.getItem("user"); */

// load plants
async function loadPlants() {
  try {
    const res = await fetch(`${BASE_URL}plants`);
    const plants = await res.json();

    console.log("PLANTS:", plants);

    plants.forEach((plant, index) => {
      // safety check
      if (!plant.coordinates || plant.coordinates.length < 2) return;

      console.log("IMAGE URL:", plant.imageUrl);

      const lat = plant.coordinates[0];
      const lng = plant.coordinates[1];

      const marker = L.marker([lat, lng]).addTo(map);

      // safer current user check (since backend auth not ready)
      const isOwner = false;

      marker.bindPopup(
        `
    <div class="popup-content">
      <h3>${plant.plantName || "Okänd växt"}</h3>

      <p>${plant.description || "Ingen beskrivning"}</p>

      <p>Ljusnivå: ${plant.light ?? "-"}</p>

      <p>Ägare: ${plant.ownerName || "Okänd"}</p>

      ${
        plant.imageUrl
          ? `<img 
          src="${
            plant.imageUrl &&
            plant.imageUrl !== "https://example.com/monstera.jpg"
              ? plant.imageUrl
              : "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
          }"
            class="popup-img"
            />`
          : ""
      }

      ${
        isOwner
          ? `
            <button class="edit-btn">Redigera</button>
            <button class="delete-btn">Ta bort</button>
          `
          : `
            <button class="trade-btn" data-id="${plant._id}">Begär byte</button>
          `
      }
    </div>
    `,
        {
          maxWidth: 220,
          minWidth: 160,
        },
      );

      // focus first marker
      if (index === 0) {
        marker.openPopup();
        map.setView([lat, lng], 13);
      }
    });
  } catch (error) {
    console.error("Error loading plants:", error);
  }
}

loadPlants();

/* // popup interactions
map.on("popupopen", (e) => {
  console.log("POPUP OPENED");

  const popup = e.popup._contentNode;

  const tradeBtn = popup.querySelector(".trade-btn");
  console.log("Button found:", tradeBtn);

  const editBtn = popup.querySelector(".edit-btn");
  const deleteBtn = popup.querySelector(".delete-btn");

  if (tradeBtn) {
    tradeBtn.onclick = () => {
      const token = localStorage.getItem("token");

      // 🔒 login check
      if (!token) {
        alert("Du måste logga in först");
        return;
      }

      const plantId = tradeBtn.dataset.id;

      console.log("CLICKED ✅");
      console.log("Plant ID:", plantId);

      // TEMP feedback (before BE)
      alert("Förfrågan skickad 🌱");

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
    };
  }
}); */

//
document.addEventListener("click", async (event) => {
  const tradeBtn = event.target.closest(".trade-btn");
  if (!tradeBtn) return;

  const token = localStorage.getItem("token");

  // 🔒 BLOCK immediately if not logged in
  if (!token) {
    alert("Du måste logga in först");
    return;
  }

  const plantId = tradeBtn.dataset.id;

  try {
    const res = await fetch(`${BASE_URL}trades/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plantId }),
    });

    const data = await res.json();

    // 🔒 Token exists but invalid/expired
    if (res.status === 401) {
      alert("Sessionen har gått ut. Logga in igen.");
      localStorage.removeItem("token");
      return;
    }

    // ❌ Business logic error (own plant etc.)
    if (!res.ok) {
      if (data.message === "You cannot trade your own plant") {
        alert("Du kan inte byta din egen växt");
      } else {
        alert("Kunde inte skicka förfrågan");
      }
      return;
    }

    // ✅ SUCCESS
    alert("Förfrågan skickad 🌱");

  } catch (error) {
    console.error(error);
    alert("Något gick fel");
  }
});