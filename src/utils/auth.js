import { loginUser } from "../utils/api.js";

// init login form
export function initLogin() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleLogin();
  });

  const toggleBtn = document.getElementById("toggle-login-password");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () =>
      togglePassword("login-password", toggleBtn),
    );
  }
}

// handle login form submission
async function handleLogin() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorMsg = document.getElementById("login-error");
  const btn = document.getElementById("login-submit-btn");

  // validation
  if (!email || !password) {
    errorMsg.textContent = "Please fill in all fields.";
    return;
  }

  errorMsg.textContent = "";
  btn.disabled = true;
  btn.textContent = "Signing in...";

  try {
    const users = await loginUser(email, password);

    if (users.length === 0) {
      errorMsg.textContent = "Invalid email or password.";
      btn.disabled = false;
      btn.textContent = "Sign In";
      return;
    }

    const user = users[0];
    const fakeToken = "mock-token-" + user.id;
    localStorage.setItem("token", fakeToken);
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address,
      }),
    );

    if (user.isAdmin) {
      window.location.href = "admin.html";
    } else {
      window.location.href = "index.html";
    }
  } catch (error) {
    errorMsg.textContent = "Login failed. Please try again.";
    btn.disabled = false;
    btn.textContent = "Login";
  }
}

// Logout function — clear localStorage and redirect to home page
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// session management functions for checking login status and user role
export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export function isAdmin() {
  const user = getCurrentUser();
  return user ? user.isAdmin : false;
}

// toggle password visibility function for both login and register forms
export function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    btn.textContent = "Hide";
  } else {
    input.type = "password";
    btn.textContent = "Show";
  }
}

// after successful login or logout, call updateNavbar to refresh the links and buttons in the navbar based on the user's login status and role
export function updateNavbar() {
  const user = getCurrentUser();
  const loginLink = document.getElementById("nav-login");
  const adminLink = document.getElementById("nav-admin");
  const logoutBtn = document.getElementById("nav-logout");
  const cartLink = document.getElementById("nav-cart"); // hide cart link for admin users

  const loginLi = loginLink ? loginLink.parentElement : null;
  const adminLi = adminLink ? adminLink.parentElement : null;
  const logoutLi = logoutBtn ? logoutBtn.parentElement : null;
  const cartLi = cartLink ? cartLink.parentElement : null;

  if (user && user.isAdmin) {
    // admin
    if (loginLi) loginLi.style.display = "none"; // hide login link for admin
    if (cartLi) cartLi.style.display = "none"; // hide cart link for admin
    if (adminLi) adminLi.style.display = "list-item";
    if (logoutLi) logoutLi.style.display = "list-item";
  } else if (user) {
    // regular user
    if (loginLink) {
      loginLink.textContent = "Profile";
      loginLink.href = "profile.html";
    }
    if (adminLi) adminLi.style.display = "none";
    if (logoutLi) logoutLi.style.display = "list-item";
  } else {
    // not logged in
    if (loginLink) {
      loginLink.textContent = "Login";
      loginLink.href = "auth.html";
    }
    if (adminLi) adminLi.style.display = "none";
    if (logoutLi) logoutLi.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();

  const logoutBtn = document.getElementById("nav-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }
});
