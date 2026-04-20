import { getBaseUrl } from "../utils/api.js";

const BASE_URL = getBaseUrl();

async function checkLoginStatus() {
  const token = localStorage.getItem("token");

// Hämta navbar-element
    const loginBtn = document.getElementById("nav-login-btn");
    const profileIconContainer = document.getElementById("profile-icon-container");
    const profileIcon = document.getElementById("profile-icon");
    const profileDropdown = document.getElementById("profile-dropdown");
    const notifLink = document.getElementById("notification-link");
    const ddName = document.getElementById("dd-name");
    const ddEmail = document.getElementById("dd-email");

// Om ingen token - visa bara login-knapp
    if (!token) {
    if (profileIconContainer) profileIconContainer.style.display = "none";
    if (notifLink) notifLink.style.display = "none";

    if (loginBtn) {
        loginBtn.textContent = "Logga in";
        loginBtn.href = "login.html";
    }
    return;
    }

// Hämta användardata
    try {
    const res = await fetch(BASE_URL + "user/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      return;
    }
    const user = await res.json();
}

// Visa profil-ikon + notiser
    if (profileIconContainer) profileIconContainer.style.display = "block";
    if (notifLink) notifLink.style.display = "block";

    if (ddName) ddName.textContent = user.name;
    if (ddEmail) ddEmail.textContent = user.email;
}