import { getBaseUrl } from "../utils/api.js";

const BASE_URL = getBaseUrl();

async function loadMyPlants(user) {
  const res = await fetch("https://plottwistgrupp11.vercel.app/plants");
  const plants = await res.json();

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

  // DELETE LOGIC
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      if (!confirm("Är du säker att du vill ta bort växten?")) return;

      try {
        const res = await fetch(
          `https://plottwistgrupp11.vercel.app/plants/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          alert("Kunde inte ta bort växt ❌");
          return;
        }

        alert("Växt borttagen 🌱");
        loadMyPlants(user); // refresh

      } catch (err) {
        console.error(err);
        alert("Något gick fel");
      }
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("loggedIn"));

  // Om ingen är inloggad - skicka till login
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // välkomsttext
  document.getElementById("welcome-text").textContent =
    `Välkommen, ${user.name}!`;

  // Ändra nav-knappen till Logga ut
  const loginBtn = document.getElementById("nav-login-btn");
loginBtn.textContent = "Logga ut";
loginBtn.href = "#";

loginBtn.addEventListener("click", () => {
  sessionStorage.removeItem("loggedIn");
    alert("Du har loggats ut!");
  window.location.href = "index.html";
});


  // Visa profil-ikon när man är inloggad
  const profileIconContainer = document.getElementById(
    "profile-icon-container",
  );
  const profileDropdown = document.getElementById("profile-dropdown");
  const profileIcon = document.getElementById("profile-icon");
  profileIconContainer.style.display = "block";

  // Användardata
  document.getElementById("dd-name").textContent = user.name;
  document.getElementById("dd-email").textContent = user.email;

  // Öppna dropdown
  profileIcon.addEventListener("click", () => {
    profileDropdown.style.display =
      profileDropdown.style.display === "block" ? "none" : "block";
  });

  // Stäng dropdown
  document.addEventListener("click", (e) => {
    if (!profileIconContainer.contains(e.target)) {
      profileDropdown.style.display = "none";
    }
  });
  // placeholder-data // kommentat ut denna. vill inte använda fake data
  /* const placeholder = {
    plants: [
      { name: "Monstera", location: "Göteborg" },
      { name: "Aloe Vera", location: "Borås" }
    ]
  }; */

  // Växter
  /* document.getElementById("plant-list").innerHTML =
    placeholder.plants.map(p => `
      <div class="list-item">
        <strong>${p.name}</strong>
        <p>Plats: ${p.location}</p>
      </div>
    `).join(""); */

  // Tabs
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;

      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(tab).classList.add("active");
    });
  });
  setTimeout(() => {
  loadMyPlants(user);
}, 0);

  loadMyPlants(user);
});
