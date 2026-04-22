import { getProducts } from "../utils/productsApi.js";
import { updateCartCount } from "../utils/cartUtils.js";
import { updateWishlistCount } from "./wishlist.js";
updateWishlistCount();
updateCartCount();

const upcomingContainer = document.getElementById("upcoming-products");
const liveContainer = document.getElementById("live-products");

function getStatusLabel(product) {
  if (product.dropStatus === "Upcoming" && product.dropAt) {
    const raw = product.dropAt?.$date ?? product.dropAt;
    return new Date(raw).toLocaleDateString("sv-SE");
  }
  return product.dropStatus;
}

function renderGrid(products, container) {
  container.innerHTML = products
    .map(
      (product) => `
        <a class="product-href" href="product.html?slug=${product.slug}">
          <article class="product-card">
            <div class="product-card__image"
              style="background-image: url('${product.images[0]?.url}')">
                <p class="products-card-drop-status">${getStatusLabel(product)}</p>
                <div>
                  <h3 class="product-card__name">${product.name}</h3>
                  <p class="product-card__price">${product.price}:-</p>
                </div>
            </div>
          </article>
        </a>
      `
    )
    .join("");
}

async function init() {
  try {
    const products = await getProducts();
    const upcoming = products
      .filter((p) => p.dropStatus === "Upcoming")
      .sort((a, b) => {
        const dateA = new Date(a.dropAt?.$date ?? a.dropAt);
        const dateB = new Date(b.dropAt?.$date ?? b.dropAt);
        return dateA - dateB;
      });
    const live = products.filter((p) => p.dropStatus === "Live");

    renderGrid(upcoming, upcomingContainer);
    renderGrid(live, liveContainer);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

init();

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
