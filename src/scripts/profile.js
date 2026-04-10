document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("loggedIn"));

  // Om ingen är inloggad - skicka till login
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // välkomsttext
  document.getElementById("welcome-text").textContent = `Välkommen, ${user.name}!`;

  // Ändra nav-knappen till Logga ut
  const navRight = document.querySelector(".nav-right a");
  navRight.textContent = "Logga ut";
  navRight.href = "#";

  navRight.addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "index.html";
  });

  // Visa profil-ikon när man är inloggad
const profileIconContainer = document.getElementById("profile-icon-container");
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
  // placeholder-data
  const placeholder = {
    plants: [
      { name: "Monstera", location: "Göteborg" },
      { name: "Aloe Vera", location: "Borås" }
    ]
  };

  // Växter
  document.getElementById("plant-list").innerHTML =
    placeholder.plants.map(p => `
      <div class="list-item">
        <strong>${p.name}</strong>
        <p>Plats: ${p.location}</p>
      </div>
    `).join("");

  // Tabs
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(tab).classList.add("active");
    });
  });
});
