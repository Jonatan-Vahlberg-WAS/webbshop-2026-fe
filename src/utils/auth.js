import { getBaseUrl } from "./api.js";

export async function register(name, email, password) {
  const url = new URL("auth/register", getBaseUrl());
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}

// Returns true if the user is logged in.
// Otherwise alerts the user and redirects them to the login page, and returns false.
export function requireAuth(message = "You need to be signed in to do that.") {
  if (isLoggedIn()) return true;
  alert(message);
  window.location.href = "/loginpage.html";
  return false;
}
