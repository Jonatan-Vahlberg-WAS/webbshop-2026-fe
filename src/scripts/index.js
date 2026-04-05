import { getProducts } from "../utils/api.js";
import { goToProduct } from "./product-detail.js";

// TEMP: Default products for rendering when backend is unavailable
const TEMP_PRODUCTS = [
  {
    id: 1,
    name: "Air Zoom Runner",
    description: "Lightweight running shoes with breathable mesh.",
    price: 120.99,
    image: "https://placehold.co/400x400",
    dropDate: "2026-04-05",
    status: "upcoming",
  },
  {
    id: 2,
    name: "StreetFlex High",
    description: "Casual sneakers perfect for daily wear.",
    price: 89.5,
    image: "https://placehold.co/400x400",
    dropDate: "2026-03-20",
    status: "live",
  },
  {
    id: 3,
    name: "TrailBlazer XT",
    description: "Rugged trail shoes designed for outdoor adventures.",
    price: 135.0,
    image: "https://placehold.co/400x400",
    dropDate: "2026-03-01",
    status: "sold out",
  },
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

// Fetch products from API, fallback to temp data if unavailable
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

  const imageSection = document.createElement("div");
  imageSection.className = "image-wrapper";

  const badge = document.createElement("span");
  badge.className = "status-badge";
  badge.textContent = product.status;

  imageSection.appendChild(badge);

  if (product.image) {
    const image = document.createElement("img");
    image.className = "product-card__image";
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";

    imageSection.appendChild(image);
  } else {
    const image = document.createElement("div");
    image.className = "product-card__image-placeholder";
    image.textContent = "👟";

    imageSection.appendChild(image);
  }

  let statusElement;

  if (product.status === "upcoming") {
    statusElement = document.createElement("p");
    statusElement.className = "drop-timer";
    statusElement.textContent = `Drop in: ${product.dropDate}`; //TODO: Replace with countdown timer
  } else if (product.status === "live") {
    statusElement = document.createElement("button");
    statusElement.className = "status-btn";
    statusElement.textContent = `Buy Now`;
  } else {
    statusElement = document.createElement("button");
    statusElement.className = "status-btn";
    statusElement.disabled = true;
    statusElement.textContent = `Sold Out`;
  }

  const productCard = document.createElement("div");
  productCard.className = "product-card__body";

  const h3 = document.createElement("h3");
  h3.textContent = product.name;
  const p = document.createElement("p");
  p.className = "product-card__price";
  p.textContent = `$${product.price.toFixed(2)}`;
  productCard.appendChild(h3);
  productCard.appendChild(p);
  productCard.appendChild(statusElement);

  element.appendChild(imageSection);
  element.appendChild(productCard);

  //Navigates to the product detail page
  element.addEventListener("click", () => goToProduct(product.id));

  return element;
}
