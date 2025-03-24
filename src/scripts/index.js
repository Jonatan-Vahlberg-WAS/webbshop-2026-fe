import dummyProducts from "../data/dummyProducts.js";

const container = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const filterBtn = document.getElementById("filterBtn");
const filterModal = document.getElementById("filterModal");
const closeModal = document.getElementById("closeModal");
const categoryList = document.getElementById("categoryList");

let currentProducts = [...dummyProducts];

window.addEventListener("DOMContentLoaded", () => {
  renderByCategory(currentProducts);
});

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = dummyProducts.filter((product) =>
    product["Product-title"].toLowerCase().includes(keyword)
  );
  renderByCategory(filtered);
});

filterBtn.addEventListener("click", () => {
  filterModal.classList.remove("hidden");
  filterModal.classList.add("show");
});

closeModal.addEventListener("click", () => {
  filterModal.classList.add("hidden");
  filterModal.classList.remove("show");
});

window.addEventListener("click", (e) => {
  if (e.target === filterModal) {
    filterModal.classList.add("hidden");
    filterModal.classList.remove("show");
  }
});

categoryList.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const selectedCategory = e.target.dataset.category;
    const filtered =
      selectedCategory === "all"
        ? dummyProducts
        : dummyProducts.filter(
            (product) => product["Category"] === selectedCategory
          );
    renderByCategory(filtered);
    filterModal.classList.add("hidden");
    filterModal.classList.remove("show");
  }
});

function renderByCategory(products) {
  container.innerHTML = "";

  const categories = [...new Set(products.map((p) => p["Category"]))];

  categories.forEach((category) => {
    const heading = document.createElement("h2");
    heading.textContent = category;
    container.appendChild(heading);

    const row = document.createElement("div");
    row.className = "product-row";

    const items = products.filter((p) => p["Category"] === category);
    items.forEach((product) => {
      row.appendChild(createProductCard(product));
    });

    container.appendChild(row);
  });
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img src="${product["Product-image-url"]}" 
         alt="${product["Product-title"]}" 
         onerror="this.onerror=null; this.src='./src/images/products/placeholder.jpg';" />
    <h3>${product["Product-title"]}</h3>
    <h4>${product["Product-description"]}</h4>
    <p><strong>${product["Product-price"]}</strong></p>
    <p class="product-meta">${product["Product-weight"]} &middot; ${product["Product-producer"]}</p>
    <a href="${product["Matsmart-url"]}" target="_blank">
      <button>Lägg i kundvagn</button>
    </a>
  `;

  return card;
}
