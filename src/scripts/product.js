import { getProducts, getProductBySlug } from "../utils/productsApi.js";
import { getCart, saveCart, updateCartCount } from "../utils/cartUtils.js";
import { updateWishlistCount } from "./wishlist.js";
import { requireAuth } from "../utils/auth.js";
updateWishlistCount();
updateCartCount();

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

let selectedSize = null;

const container =
  document.querySelector("#product-detail") ||
  document.querySelector(".product-page");
const mainImage = document.getElementById("main-image");
const titleElement = document.getElementById("product-name");
const priceElement = document.getElementById("product-price");
const brandElement = document.getElementById("product-brand");
const countdownEl = document.getElementById("countdown");
const addToCartButton = document.getElementById("addToCartBtn");
const sizeSelect = document.getElementById("size-selector");
const colorSelector = document.getElementById("color-selector");
const wishlistButton = document.getElementById("wishlistBtn");
const productDesc = document.getElementById("product-desc");
const productMeta = document.getElementById("product-meta");
const imgNavUp = document.querySelector(".img-nav--up");
const imgNavDown = document.querySelector(".img-nav--down");

let currentImageIndex = 0;
let productImages = [];

function setImage(index) {
  if (!productImages.length) return;
  currentImageIndex = (index + productImages.length) % productImages.length;
  mainImage.src = productImages[currentImageIndex].url;
}

function startCountdown(dropAt) {
  const update = () => {
    const diff = Math.max(0, new Date(dropAt) - new Date());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    countdownEl.textContent = `Dropping: ${d.toString().padStart(2, "0")}d : ${h.toString().padStart(2, "0")}h : ${m.toString().padStart(2, "0")}m : ${s.toString().padStart(2, "0")}s`;
  };
  update();
  setInterval(update, 1000);
}

const getProductById = async (slug) => {
  const product = await getProductBySlug(slug);

  if (!product) {
    document.querySelector(".product-page").innerHTML =
      "<p>Product not found</p>";
    return;
  }

  productImages = product.images || [];
  setImage(0);
  mainImage.alt = product.name;

  titleElement.textContent = product.name;
  document.title = `${product.name} - Sole Search`;
  if (brandElement) brandElement.textContent = product.brand || "";

  if (priceElement) priceElement.textContent = `${product.price} kr`;

  if (product.dropAt) {
    startCountdown(product.dropAt);
  } else if (product.dropStatus) {
    countdownEl.textContent = product.dropStatus;
  }

  if (productDesc && product.description) {
    productDesc.textContent = product.description;
  }

  if (productMeta) {
    productMeta.innerHTML = [
      product.articleNo ? `<span>Article no: ${product.articleNo}</span>` : "",
      product.gender ? `<span>Gender: ${product.gender}</span>` : "",
      product.colorName ? `<span>Color: ${product.colorName}</span>` : "",
    ].join("");
  }

  imgNavUp.addEventListener("click", () => setImage(currentImageIndex - 1));
  imgNavDown.addEventListener("click", () => setImage(currentImageIndex + 1));

  // Size buttons
  addToCartButton.disabled = true;
  addToCartButton.textContent = "SELECT SIZE";

  sizeSelect.innerHTML = product.sizes
    .map((size) => `<button data-size="${size.size}">${size.size}</button>`)
    .join("");

  const sizeButtons = sizeSelect.querySelectorAll("button");
  sizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      sizeButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      selectedSize = button.dataset.size;

      const selectedSizeObject = product.sizes.find(
        (s) => String(s.size) === selectedSize,
      );

      if (selectedSizeObject.stock > 0) {
        addToCartButton.disabled = false;
        addToCartButton.textContent = "ADD TO CART";
      } else {
        addToCartButton.disabled = true;
        addToCartButton.textContent = "OUT OF STOCK";
      }
    });
  });

  // Color buttons
  if (colorSelector && product.colors?.length) {
    colorSelector.innerHTML = product.colors
      .map((c) => `<span>${c.name}</span>`)
      .join("");
  }

  addToCartButton.addEventListener("click", () => {
    if (!selectedSize) return;
    if (!requireAuth("You need to be signed in to add items to your cart."))
      return;

    const item = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: productImages[0]?.url,
      size: selectedSize,
      quantity: 1,
    };

    let cart = getCart() || [];
    const existingItem = cart.find(
      (cartItem) =>
        cartItem.productId === item.productId && cartItem.size === item.size,
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push(item);
    }

    saveCart(cart);
    updateCartCount();
  });

  wishlistButton.addEventListener("click", () => {
    if (!requireAuth("You need to be signed in to add items to your wishlist."))
      return;

    const item = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: productImages[0]?.url,
      dropAt: product.dropAt,
    };

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.find((w) => w.productId === product._id);

    if (exists) {
      alert("Already in wishlist!");
    } else {
      wishlist.push(item);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      updateWishlistCount();
      alert("Added to wishlist!");
    }
  });
};

getProductById(slug);
