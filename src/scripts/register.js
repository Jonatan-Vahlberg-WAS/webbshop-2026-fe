import { registerUser, loginUser } from "../utils/api.js";
import { initLogin, togglePassword } from "../utils/auth.js";
import { updateCartBadge } from "../utils/utility.js";

updateCartBadge();

document.addEventListener("DOMContentLoaded", () => {
  initRegister();
  initLogin(); // from auth.js
});

//Shows the register form and hides the login form
function showRegister() {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("register-section").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("register-section").classList.add("hidden");
  document.getElementById("login-section").classList.remove("hidden");
}

// Initializes event listeners for the registration form
function initRegister() {
  // form submit
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleRegister();
  });

  document
    .getElementById("go-to-register-btn")
    .addEventListener("click", showRegister);

  document
    .getElementById("go-to-login-btn")
    .addEventListener("click", showLogin);

  // toggle password buttons
  document
    .getElementById("toggle-register-password")
    .addEventListener("click", () =>
      togglePassword(
        "register-password",
        document.getElementById("toggle-register-password"),
      ),
    );

  document
    .getElementById("toggle-register-confirm")
    .addEventListener("click", () =>
      togglePassword(
        "register-confirm",
        document.getElementById("toggle-register-confirm"),
      ),
    );

  // real-time password check
  document
    .getElementById("register-password")
    .addEventListener("input", checkPasswordRules);
}

// Checks password rules and updates the UI indicators
function checkPasswordRules() {
  const password = document.getElementById("register-password").value;

  const rules = {
    "req-length": password.length >= 8,
    "req-upper": /[A-Z]/.test(password),
    "req-number": /[0-9]/.test(password),
    "req-special": /[!@#$%&*]/.test(password),
  };

  for (const [id, passed] of Object.entries(rules)) {
    const el = document.getElementById(id);
    if (passed) {
      el.style.color = passed ? "green" : "red";
    } else {
      el.style.color = ""; // reset to default
    }
  }
}

// Validates input and registers the user
async function handleRegister() {
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  const confirm = document.getElementById("register-confirm").value;
  const errorMsg = document.getElementById("register-error");

  if (!name || !email || !password || !confirm) {
    errorMsg.textContent = "Please fill in all fields.";
    return;
  }
  if (password.length < 8) {
    errorMsg.textContent = "Password must be at least 8 characters.";
    return;
  }
  if (!/[A-Z]/.test(password)) {
    errorMsg.textContent = "Password must contain at least one capital letter.";
    return;
  }
  if (!/[0-9]/.test(password)) {
    errorMsg.textContent = "Password must contain at least one number.";
    return;
  }
  if (!/[!@#$%&*]/.test(password)) {
    errorMsg.textContent =
      "Password must contain at least one special character (! @ # $ % & *).";
    return;
  }
  if (password !== confirm) {
    errorMsg.textContent = "Passwords do not match.";
    return;
  }

  errorMsg.textContent = "";

  try {
    const data = await registerUser(name, email, password);
    console.log("Register response:", data);
    const { accessToken, refreshToken } = data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    window.location.href = "index.html";
  } catch (error) {
    errorMsg.textContent =
      error.message || "Registration failed. Please try again.";
  }
}
