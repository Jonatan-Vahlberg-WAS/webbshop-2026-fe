import { getBaseUrl } from "./api.js";

export async function registerUser(firstName, lastName, address, city, postCode, email, password) {
  const url = new URL("auth/register", getBaseUrl());
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
        firstName,
        lastName,
        email,
        password,
        location: {
            address,
            city,
            postCode
        }
    }),
  });

  if (response.ok) {
    return response.json();
  }

    const err = await response.json().catch(() => ({}));
    console.log("Fel från backend:", err);
    const errorMessages = err.errors 
    ? err.errors.map(e => e.message).join("\n") 
    : err.message || "Registrering misslyckades";

    throw new Error(errorMessages);
}

export async function loginUser(email, password) {
  const url = new URL("auth/login", getBaseUrl());
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    return response.json();
  }

    const err = await response.json().catch(() => ({}));
    console.log("Fel från backend:", err);
    const errorMessages = err.errors 
    ? err.errors.map(e => e.message).join("\n") 
    : err.message || "Registrering misslyckades";

    throw new Error(errorMessages);
}

export async function getProfile() {
    const token = localStorage.getItem("token");
    const url = new URL("users/profile", getBaseUrl());
    const response = await fetch(url, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
    });

    if(response.ok) {
        return response.json();
    }

    if(response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/loginpage.html";
    }

    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Kunde inte hämta profil!");
}

export async function updateProfile(updatedData) {
    console.log(updatedData)
    const token = localStorage.getItem("token");
    const url = new URL("users/profile", getBaseUrl());

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
    });

    if (response.ok) {
        const data = await response.json();
        console.log("Svar från backend:", data);
        return data;
    }

    const err = await response.json().catch(() => ({}));
    console.log("FEL FRÅN BACKEND:", err);
    throw new Error(err.message || "Kunde inte uppdatera profil");
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function getUsers() {
  const url = new URL("users", getBaseUrl());
  console.log("getUsers url:", url.toString()); 
  const response = await fetch(url, { headers: getAuthHeaders() });
   console.log("getUsers status:", response.status);
  if (response.ok) return response.json();
  const err = await response.json().catch(() => ({}));
  throw new Error(err.error || "Failed to get users");
}

export async function updateUser(id, data) {
  const url = new URL(`users/${id}`, getBaseUrl());
  const response = await fetch(url, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (response.ok) return response.json();
  const err = await response.json().catch(() => ({}));
  throw new Error(err.error || "Failed to update user");
}

export async function deactivateUser(id) {
  const url = new URL(`users/${id}/deactivate`, getBaseUrl());
  const response = await fetch(url, { method: "DELETE", headers: getAuthHeaders() });
  if (response.ok) return response.json();
  const err = await response.json().catch(() => ({}));
  throw new Error(err.error || "Failed to deactivate user");
}

export async function reactivateUser(id) {
  const url = new URL(`users/${id}/reactivate`, getBaseUrl());
  const response = await fetch(url, { method: "PATCH", headers: getAuthHeaders() });
  if (response.ok) return response.json();
  const err = await response.json().catch(() => ({}));
  throw new Error(err.error || "Failed to reactivate user");
}

export async function deleteUserPermanent(id) {
  const url = new URL(`users/${id}/permanent`, getBaseUrl());
  const response = await fetch(url, { method: "DELETE", headers: getAuthHeaders() });
  if (response.ok) return response.json();
  const err = await response.json().catch(() => ({}));
  throw new Error(err.error || "Failed to permanently delete user");
}

export async function makeAdmin(id) {
  const url = new URL(`users/${id}/make-admin`, getBaseUrl());
  const response = await fetch(url, { method: "POST", headers: getAuthHeaders() });
  if (response.ok) return response.json();
  const err = await response.json().catch(() => ({}));
  throw new Error(err.error || "Failed to make user admin");
}

export async function removeAdmin(id) {
  const url = new URL(`users/${id}/remove-admin`, getBaseUrl());
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.ok) return response.json();
  const err = await response.json().catch(() => ({}));
  throw new Error(err.error || "Failed to remove admin");
}