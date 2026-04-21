import { getPlants } from "../utils/productsApi.js";
import { getBaseUrl } from "../utils/api.js";

const BASE_URL = getBaseUrl();

export async function loadMyPlants(user) {
  const plants = await getPlants();

  console.log("plants:", plants);

  const container = document.getElementById("plant-list");

  container.innerHTML = plants
    .map(
      (p) => `
      <div class="list-item">
        <img src="${p.imageUrl || p.image}" width="60" />
        <div>
          <strong>${p.plantName || p.name}</strong>
          <p>Plats: ${p.location || "Okänd"}</p>
          <button class="delete-btn" data-id="${p._id}">Ta bort</button>
        </div>
      </div>
    `
    )
    .join("");

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      if (!confirm("Är du säker?")) return;

      try {
        const res = await fetch(BASE_URL + "plants/" + id, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          alert("Kunde inte ta bort växt ❌");
          return;
        }

        alert("Växt borttagen 🌱");
        loadMyPlants(user);

      } catch (err) {
        console.error(err);
        alert("Något gick fel");
      }
    });
  });
}