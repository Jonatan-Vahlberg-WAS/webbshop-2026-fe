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

});
