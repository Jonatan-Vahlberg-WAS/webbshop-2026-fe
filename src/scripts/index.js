import { getProducts } from "../utils/productsApi.js";
import { updateCartCount } from "../utils/cartUtils.js";
import { updateWishlistCount } from "./wishlist.js";
updateWishlistCount();
updateCartCount();

// TEMP: Default products for rendering when backend is unavailable
const TEMP_PRODUCTS = [
  { name: "Organic Tomatoes", price: 4.99, image: null },
  { name: "Fresh Milk", price: 2.49, image: null },
  { name: "Whole Grain Bread", price: 3.99, image: null },
  { name: "Free Range Eggs", price: 5.49, image: null },
  { name: "Bananas", price: 1.29, image: null },
  { name: "Greek Yogurt", price: 3.79, image: null },
];

document.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "<p>Loading products...</p>";

  try {
    const products = await getProducts();
    productsContainer.innerHTML = "";

    const toRender = products.length > 0 ? products : TEMP_PRODUCTS;
    if (products.length === 0) {
      productsContainer.dataset.temp = "true";
      const notice = document.createElement("p");
      notice.className = "temp-notice";
      notice.textContent = "Showing demo products (backend unavailable)";
      productsContainer.appendChild(notice);
    }

    toRender.forEach((product) => {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = "";
    productsContainer.dataset.temp = "true";
    const notice = document.createElement("p");
    notice.className = "temp-notice";
    notice.textContent = "Showing demo products (backend unavailable)";
    productsContainer.appendChild(notice);
    TEMP_PRODUCTS.forEach((product) => {
      productsContainer.appendChild(createProductCard(product));
    });
  }
}

// Function to create an individual product card
function createProductCard(product) {
  const element = document.createElement("a");
  element.className = "product-card product-href";
  element.href = `product.html?slug=${product.slug}`;

  const imageSection = product.images
    ? `<img class="product-card__image" src="${product.images[0].url}" alt="${product.name}" loading="lazy" />`
    : `<div class="product-card__image-placeholder">🥬</div>`;

  element.innerHTML = `
    ${imageSection}
    <div class="product-card__body">
      <h3>${product.name}</h3>
      <p class="product-card__price">${product.price.toFixed(2)}:-</p>
    </div>
  `;

  element.querySelector(".add-to-cart-btn")?.addEventListener("click", () => {
    alert(`Adding ${product.name} to cart\nFunctionality not implemented yet`);
  });

  return element;
}

const heroContent = document.querySelector(".hero");
const images = ["public/hero.png", "public/hero2.png", "public/hakim.png"];
let index = 0;

heroContent.style.backgroundImage = `url('${images[index]}')`;

heroContent.innerHTML = `<div class="arrowSection">
  <button class="leftArrow"><i class="fa solid fa-arrow-left"></i></button>
  <p class="heroTimer"></p>
  <button class="rightArrow"><i class="fa solid fa-arrow-right"></i></button>
</div>
<div class="infoSection">
  <p>releasing this week :</p>
  <h2 class="shoe-release">AIR JORDAN X ARCH 1 RETRO HIGH SNEAKER</h2>
  <a href="products.html"><button class="heroShop">SHOP</button></a>
</div>`;

const heroTimer = document.querySelector(".heroTimer");

function updateCountdown() {
  const targetDate = new Date("2026-04-08"); // sätt ditt datum här
  const now = new Date();
  const diff = targetDate - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  heroTimer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

const leftArrow = document.querySelector(".leftArrow");
const rightArrow = document.querySelector(".rightArrow");

leftArrow.addEventListener("click", () => {
  index = (index - 1 + images.length) % images.length;
  heroContent.style.backgroundImage = `url('${images[index]}')`;
});

rightArrow.addEventListener("click", () => {
  index = (index + 1) % images.length;
  heroContent.style.backgroundImage = `url('${images[index]}')`;
});

const heroBtn = document.querySelector(".heroShop");

heroBtn.addEventListener("click", () => {});
