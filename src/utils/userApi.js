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