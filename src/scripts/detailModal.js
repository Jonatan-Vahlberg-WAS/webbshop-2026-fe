// detailModal.js
import dummyProducts from "../data/dummyProducts.js";

export function showProductDetailModal(productTitle) {
  const product = dummyProducts.find((item) => item["Product-title"] === productTitle);

  if (!product) return;

  // 
  const existingModal = document.querySelector("#product-detail-modal");
  if (existingModal) existingModal.remove();

  // 
  const modal = document.createElement("div");
  modal.id = "product-detail-modal";
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <h2>${product["Product-title"]}</h2>
      <img src="${product["Product-image-url"]}" alt="${product["Product-title"]}">
      <p>${product["Product-description"]}</p>
      <p><strong>Vikt:</strong> ${product["Product-weight"]}</p>
      <p><strong>Producent:</strong> ${product["Product-producer"]}</p>
      <p><strong>Pris:</strong> ${product["Product-price"]}</p>
      <a href="${product["Matsmart-url"]}" target="_blank">Mer info hos Matsmart</a>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".modal-close").addEventListener("click", () => modal.remove());
  modal.querySelector(".modal-overlay").addEventListener("click", () => modal.remove());
}
