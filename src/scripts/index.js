import { fetchProducts } from "../utils/api.js";
import { createProductCard } from "../services/createProductCard.js";
import { showCategories } from "../services/showCategories.js";
import { searchProduct } from "../services/searchProduct.js";
import { addToCart } from "../services/addToCart.js";
import { productList } from "../../tempTestData/products.js";
import { printOrderForm } from "../services/printOrderForm.js";

document.addEventListener("DOMContentLoaded", loadProducts);

export let products;

// Function to fetch and render products
async function loadProducts() {
  const productsContainer = document.getElementById("productContainer");
  productsContainer.innerHTML = "<p>Loading products...</p>"; // Temporary message while loading

  try {
    products = await fetchProducts();
    // products = productList;

    productsContainer.innerHTML = ""; // Clear loading text

    if (products.length > 0) {
      createProductCard(products);
      showCategories(products);
    } else {
      productsContainer.innerHTML = "<p>No products available.</p>";
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = "<p>Failed to load products.</p>";
  }
}

//funktionalitet checkout-knapp
const printFormBtn = document.querySelector("#checkout");
printFormBtn.addEventListener("click", printOrderForm);

// Fuction search products with searchbar
const searchBtn = document.querySelector("#searchBtn");
const searchbar = document.querySelector(".search");

searchBtn.addEventListener("click", () =>
  searchProduct(searchbar.value, createProductCard, products)
);
searchbar.addEventListener("input", () =>
  searchProduct(searchbar.value, createProductCard, products)
);

//Function to make the searchfield active if clicked outside input-field

const searchfield = document.querySelector(".searchfield");

searchfield.addEventListener("click", () => {
  searchbar.focus();
});
