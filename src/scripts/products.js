import { getProducts } from "../utils/productsApi.js";
import { updateCartCount } from "../utils/cartUtils.js";
import { updateWishlistCount } from "./wishlist.js";
updateWishlistCount();
updateCartCount();
const container = document.querySelector("#products");

const init = async () => {
  if (!container) return;

  container.innerHTML = "<p>Loading...</p>";
  try {
    const products = await getProducts();
    if (products.length === 0) {
      container.innerHTML = "No products found.";
      return;
    }
    console.log(products);

    function renderProducts(products) {
      container.innerHTML = products
        .map(
          (product) => `
                <a class="product-href" href="product.html?slug=${product.slug}">
                    <article class="product-card">
                      <div class="product-card__image"
                        style="background-image: url('${product.images[0]?.url}')">
                          <p class="products-card-drop-status">${product.dropStatus}</p>
                          <div>
                            <h3 class="product-card__name">${product.name}</h3>
                            <p class="product-card__price">${product.price}:-</p>
                          </div>
                      </div>
                  </article>
                </a>
            `,
        )
        .join("");
    }

    const brandFilter = document.querySelector("#brandFilter");
    const sizeFilter = document.querySelector("#sizeFilter");
    const colorFilter = document.querySelector("#colorFilter");
    const dropStatusFilter = document.querySelector("#dropStatusFilter");
    const priceFilter = document.querySelector("#priceFilter");
    const stockFilter = document.querySelector("#stockFilter");
    const filterDropdown = document.querySelector("#filterDropdown");
    const urlParams = new URLSearchParams(window.location.search);
    const dropStatusParam = urlParams.get("dropStatus");
    const brandParam = urlParams.get("brand");
    const filterBtn = document.querySelector("#filterBtn");
    const wrapper = document.querySelector(".products-wrapper");

    if (dropStatusParam) {
      renderProducts(products.filter((p) => p.dropStatus === dropStatusParam));
    } else if (brandParam) {
      renderProducts(products.filter((p) => p.brand === brandParam));
    } else {
      renderProducts(products);
    }

    [...new Set(products.map((p) => p.brand))].forEach((brand) => {
      brandFilter.innerHTML += `<option value="${brand}">${brand}</option>`;
    });

    [...new Set(products.flatMap((p) => p.sizes.map((s) => s.size)))].forEach(
      (size) => {
        sizeFilter.innerHTML += `<option value="${size}">${size}</option>`;
      },
    );

    [...new Set(products.flatMap((p) => p.colors.map((s) => s.name)))].forEach(
      (color) => {
        colorFilter.innerHTML += `<option value="${color}">${color}</option>`;
      },
    );

    [...new Set(products.map((p) => p.dropStatus))].forEach((status) => {
      dropStatusFilter.innerHTML += `<option value="${status}">${status}</option>`;
    });

    filterBtn.addEventListener("click", () => {
      filterDropdown.classList.toggle("hidden");
      wrapper.classList.toggle("filter-open"); // 🔥 THIS is the key
    });

    document.querySelector("#applyFilter").addEventListener("click", () => {
      const applyFiltered = products.filter((p) => {
        if (brandFilter.value && p.brand !== brandFilter.value) return false;
        if (
          sizeFilter.value &&
          !p.sizes.some((c) => c.size === sizeFilter.value)
        )
          return false;
        if (
          colorFilter.value &&
          !p.colors.some((c) => c.name === colorFilter.value)
        )
          return false;
        if (dropStatusFilter.value && p.dropStatus !== dropStatusFilter.value)
          return false;
        if (priceFilter.value && p.price > Number(priceFilter.value))
          return false;
        if (stockFilter.value && String(p.inStock) !== stockFilter.value)
          return false;
        return true;
      });
      renderProducts(applyFiltered);
    });
  } catch (error) {
    console.error("Failed to load products:", error);
    console.log(error);

    container.innerHTML = `
        <p style="color: red;">Failed to load products. Please try again.</p>
        `;
  }
};
init();
