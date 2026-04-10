import { getBaseUrl } from "../utils/api.js";

const form = document.getElementById("plantForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const BASE_URL = getBaseUrl();

  // get values
  const plantName = document.getElementById("plantName").value;
  const imageUrl = document.getElementById("plantImage").value;
  const light = Number(document.getElementById("lightLevel").value);

  // 👉 TEMP: fixed Stockholm coordinates
  const coordinates = [59.33, 18.06];

  const newPlant = {
    plantName,
    description: "", // optional for now
    light,
    water: 1, // default (backend expects it)
    imageUrl,
    coordinates,
    meetingTime: new Date().toISOString(),
    available: true
  };

  console.log("Sending plant:", newPlant);

  try {
    const res = await fetch(BASE_URL + "plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPlant)
    });
    
    console.log("STATUS:", res.status);

    const data = await res.json();
    console.log("RESPONSE:", data);

    // reset form
    form.reset();

    // optional: redirect to map
    /* window.location.href = "/map.html"; */

  } catch (error) {
    console.error("Error saving plant:", error);
  }
});