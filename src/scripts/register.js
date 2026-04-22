import { registerUser } from "../utils/userApi.js";
import { updateWishlistCount } from "./wishlist.js";
updateWishlistCount();

document.addEventListener("DOMContentLoaded", initRegister);

function initRegister() {
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleRegister();
  });
}

async function handleRegister() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const postCode = document.getElementById("postCode").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await registerUser(firstName, lastName, address, city, postCode, email, password);
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    window.location.href = "/index.html";
  } catch (error) {
    alert(error.message);
  }
}