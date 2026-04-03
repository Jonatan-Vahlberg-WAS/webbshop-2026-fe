import { getProducts } from "../utils/api.js";
import { goToProduct } from "./product-detail.js";

// TEMP: Default products for rendering when backend is unavailable
const TEMP_PRODUCTS = [
  { id: 1, name: "Air Zoom Runner", description: "Lightweight running shoes with breathable mesh.", price: 120.99, image: "https://placehold.co/400x400", dropDate: "2026-04-05", status: "upcoming" },
  { id: 2, name: "StreetFlex High", description: "Casual sneakers perfect for daily wear.", price: 89.5, image: "https://placehold.co/400x400", dropDate: "2026-03-20", status: "live" },
  { id: 3, name: "TrailBlazer XT", description: "Rugged trail shoes designed for outdoor adventures.", price: 135.0, image: "https://placehold.co/400x400", dropDate: "2026-03-01", status: "sold out" }
];

document.addEventListener("DOMContentLoaded", loadProducts);

function showTempProducts(productsContainer) {
  productsContainer.dataset.temp = "true";
  const notice = document.createElement("p");
  notice.className = "temp-notice";
  notice.textContent = "Showing demo products (backend unavailable)";
  productsContainer.appendChild(notice);
  TEMP_PRODUCTS.forEach((product) => {
    productsContainer.appendChild(createProductCard(product));
  });
}

async function loadProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "<p>Loading products...</p>";

  try {
    const products = await getProducts();
    console.log(products);
    productsContainer.innerHTML = "";

    if (products.length === 0) {
      showTempProducts(productsContainer);
    } else {
      products.forEach((product) => {
        const card = createProductCard(product);
        productsContainer.appendChild(card);
      }); 
    }

  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = "";
    showTempProducts(productsContainer);
  }
}

// Function to create an individual product card
function createProductCard(product) {
  const element = document.createElement("div");
  element.className = "product-card";

  const imageSection = product.image
    ? `<div class="image-wrapper">
        <span class="status-badge">${product.status}</span>
        <img class="product-card__image" src="${product.image}" alt="${product.name}" loading="lazy" />
        </div>`
    : `<div class="image-wrapper">
        <span class="status-badge">${product.status}</span>
        <div class="product-card__image-placeholder">👟</div>
        </div>`;
        // Remove emoji placeholder later

  let statusButton; 

  if (product.status === "upcoming") {
    statusButton = `<p>Drop in: ${product.dropDate}</p>`
  } else if(product.status === "live") {
    statusButton = `<button class="status-btn">Buy Now</button>`
  } else {
    statusButton = `<button class="status-btn" disabled>Sold Out</button>`
  }

  //Update price from $ to kr later?
  element.innerHTML = `
    ${imageSection}
    <div class="product-card__body">
      <h3>${product.name}</h3>
      <p class="product-card__price">$${product.price.toFixed(2)}</p>
      ${statusButton}
    </div>
  `;

  //Navigates to the product detail page
  element.addEventListener("click", () => goToProduct(product.id));

  return element;
}
