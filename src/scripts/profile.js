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
});
