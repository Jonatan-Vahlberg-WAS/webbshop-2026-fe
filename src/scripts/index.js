import { getProducts } from "../utils/api.js";
import { goToProduct } from "./product-detail.js";
import { formatDateISO } from "../utils/utility.js";

document.addEventListener("DOMContentLoaded", loadProducts);

// Fetch products from API, fallback to temp data if unavailable
async function loadProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "<p>Loading products...</p>";

  try {
    const products = await getProducts();
    console.log(products);
    productsContainer.innerHTML = "";

    products.forEach((product) => {
      const card = createProductCard(product);
      productsContainer.appendChild(card);
    });

    const nextDrop = getNextDrop(products);
    const heroImage = document.getElementById("hero-product-image");
    const heroName = document.getElementById("hero-product-name");
    const heroTimer = document.getElementById("hero-product-timer");

    if (nextDrop && heroImage) {
      renderHero(nextDrop);
    } else if (heroImage) {
        heroName.textContent = "No upcoming drops";
        heroTimer.textContent = "Check back soon!";
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = "<p>Could not load products. Please try again later</p>";
  }
}

function getLatestDrops(products) {
  return products.filter((product) => product.status === "live" || product.status === "upcoming");
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
    statusElement.textContent = `Drop in: ${formatDateISO(product.dropDate)}`; //TODO: Replace with countdown timer
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

function renderHero(product) {
  const heroProductImage = document.getElementById("hero-product-image");
  const heroProductName = document.getElementById("hero-product-name");
  const heroProductTimer = document.getElementById("hero-product-timer");
  const heroBtn = document.getElementById("hero-btn");

  heroProductImage.src = product.image;
  heroProductName.textContent = product.name;
  heroProductTimer.textContent = `Drop in: ${formatDateISO(product.dropDate)}`; //TODO: Replace with countdown timer 
  
  heroBtn.addEventListener("click", () => goToProduct(product.id));

}

function getNextDrop(products) {
  let upcomingDrops = products.filter((product) => product.status === "upcoming");

  let nextDrop = upcomingDrops.sort((a, b) => new Date(a.dropDate) - new Date(b.dropDate))[0];

  return nextDrop;

}