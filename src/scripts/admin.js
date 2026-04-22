import { getProducts, createProduct } from "../utils/productsApi.js";

const token = localStorage.getItem("token")
const payload = token ? JSON.parse(atob(token.split(".")[1])) : null

if (!payload || payload.role !== "admin") {
  window.location.replace("/index.html")
}

const form = document.getElementById("createProductForm");
const tbody = document.getElementById("productsTableBody");
const nameInput = document.getElementById("name");
const slugInput = document.getElementById("slug");

nameInput.addEventListener("input", () => {
  slugInput.value = nameInput.value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const stock = parseInt(document.getElementById("stock").value, 10);
  const image = document.getElementById("image").value.trim();
  const slug = slugInput.value.trim();

  try {
    await createProduct({ name, price, stock, image, slug });
    form.reset();
    loadProducts();
  } catch (err) {
    alert(err.message || "Failed to create product");
  }
});

async function loadProducts() {
  tbody.innerHTML = "<tr><td colspan=\"4\">Loading...</td></tr>";
  try {
    const products = await getProducts();
    if (products.length === 0) {
      tbody.innerHTML = "<tr><td colspan=\"4\">No products yet.</td></tr>";
      return;
    }
    tbody.innerHTML = products
      .map(
        (p) =>
          `<tr><td>${p.name}</td><td>$${Number(p.price).toFixed(2)}</td><td>${p.stock}</td><td>${p.slug}</td></tr>`
      )
      .join("");
  } catch {
    tbody.innerHTML = "<tr><td colspan=\"4\">Failed to load products.</td></tr>";
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
