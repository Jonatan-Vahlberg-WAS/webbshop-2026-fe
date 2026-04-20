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

    if (!token) {
    if (profileIconContainer) profileIconContainer.style.display = "none";
    if (notifLink) notifLink.style.display = "none";

    if (loginBtn) {
        loginBtn.textContent = "Logga in";
        loginBtn.href = "login.html";
    }
    return;
    }

}