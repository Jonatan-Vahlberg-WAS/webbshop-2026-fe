import { map } from "../utils/map.js";

import { getBaseUrl } from "../utils/api.js";

// console.log("map_page.js is running");

// const BASE_URL = getBaseUrl();

// // simulate login (can be null)
// /* const currentUser = localStorage.getItem("user"); */


/* // popup interactions
map.on("popupopen", (e) => {
  console.log("POPUP OPENED");

  const popup = e.popup._contentNode;

  const tradeBtn = popup.querySelector(".trade-btn");
  console.log("Button found:", tradeBtn);

  const editBtn = popup.querySelector(".edit-btn");
  const deleteBtn = popup.querySelector(".delete-btn");

  if (tradeBtn) {
    tradeBtn.onclick = () => {
      const token = localStorage.getItem("token");

      // 🔒 login check
      if (!token) {
        alert("Du måste logga in först");
        return;
      }

      const plantId = tradeBtn.dataset.id;

      console.log("CLICKED ✅");
      console.log("Plant ID:", plantId);

      // TEMP feedback (before BE)
      alert("Förfrågan skickad 🌱");

      if (editBtn) {
        editBtn.onclick = () => {
          alert("Edit kommer senare");
        };
      }

      if (deleteBtn) {
        deleteBtn.onclick = () => {
          alert("Delete kommer senare");
        };
      }
    };
  }
}); */


// 
document.addEventListener("click", (event) => {
  const tradeBtn = event.target.closest(".trade-btn");
  const editBtn = event.target.closest(".edit-btn");
  const deleteBtn = event.target.closest(".delete-btn");

  // BEGÄR BUTTON
  if (tradeBtn) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Du måste logga in först");
      return;
    }

    const plantId = tradeBtn.dataset.id;

    console.log("CLICKED ✅");
    console.log("Plant ID:", plantId);

    alert("Förfrågan skickad 🌱");
  }

  // 
  if (editBtn) {
    alert("Edit kommer senare");
  }

  // 
  if (deleteBtn) {
    alert("Delete kommer senare");
  }
});