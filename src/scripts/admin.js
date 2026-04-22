import { getProducts, createProduct, updateProduct, deleteProduct } from "../utils/productsApi.js";
import { updateWishlistCount } from "./wishlist.js";
updateWishlistCount();

const token = localStorage.getItem("token")
const payload = token ? JSON.parse(atob(token.split(".")[1])) : null

if (!payload || payload.role !== "admin") {
  window.location.replace("/index.html")
}
import { getUsers, deactivateUser, reactivateUser, deleteUserPermanent, makeAdmin, removeAdmin } from "../utils/userApi.js";
import { getAllOrders, updateOrderStatus} from "../utils/ordersApi.js";

// DOM references
const form = document.getElementById("createProductForm");
const tbody = document.getElementById("productsTableBody");
const sizesContainer = document.getElementById("sizesContainer");
const addSizeBtn = document.getElementById("addSizeBtn");
const colorsContainer = document.getElementById("colorsContainer");
const addColorBtn = document.getElementById("addColorBtn");
const openCreateModalBtn = document.getElementById("openCreateModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const productModal = document.getElementById("productModal");
const nameInput = document.getElementById("name");
const slugInput = document.getElementById("slug");

let editingProductId = null;

// ─── Modal ───────────────────────────────────────────────────────────────────

openCreateModalBtn.addEventListener("click", () => {
  productModal.style.display = "flex";
  document.getElementById("modalTitle").textContent = "Create Product";
  initPreview();
});

closeModalBtn.addEventListener("click", closeModal);

productModal.addEventListener("click", (e) => {
  if (e.target === productModal) closeModal();
});

function closeModal() {
  productModal.style.display = "none";
  editingProductId = null;
  document.getElementById("submitBtn").textContent = "Create Product";
}

document.getElementById("images").addEventListener("change", (e) => {
  const files = e.target.files;
  const fileNames = document.getElementById("fileNames");
  fileNames.textContent = files.length > 0
    ? Array.from(files).map((f) => f.name).join(", ")
    : "No files chosen";
});

function showConfirm(title, message) {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirmModal");
    document.getElementById("confirmTitle").textContent = title;
    document.getElementById("confirmMessage").textContent = message;
    modal.style.display = "flex";

    const okBtn = document.getElementById("confirmOkBtn");
    const cancelBtn = document.getElementById("confirmCancelBtn");
    const closeBtn = document.getElementById("confirmCloseBtn");

    function cleanup(result) {
      modal.style.display = "none";
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
      closeBtn.removeEventListener("click", onCancel);
      resolve(result);
    }

    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }

    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
    closeBtn.addEventListener("click", onCancel);
  });
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

document.querySelectorAll(".admin-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
    document.getElementById(`${tab.dataset.tab}-tab`).classList.add("active");

     if (tab.dataset.tab === "users") loadUsers();
     if (tab.dataset.tab === "orders") loadOrders();
  });
});

// ─── Filters ──────────────────────────────────────────────────────────────────

function filterProducts() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const brand = document.getElementById("filterBrand").value.toLowerCase();
  const status = document.getElementById("filterStatus").value.toLowerCase();

  document.querySelectorAll("#productsTableBody tr").forEach((row) => {
    const text = row.textContent.toLowerCase();
    const matchesSearch = text.includes(query);
    const matchesBrand = brand ? text.includes(brand) : true;
    const matchesStatus = status ? text.includes(status) : true;
    row.style.display = matchesSearch && matchesBrand && matchesStatus ? "" : "none";
  });
}

document.getElementById("searchInput").addEventListener("input", filterProducts);
document.getElementById("filterBrand").addEventListener("change", filterProducts);
document.getElementById("filterStatus").addEventListener("change", filterProducts);

// ─── Colors ───────────────────────────────────────────────────────────────────

addColorBtn.addEventListener("click", () => {
  const div = document.createElement("div");
  div.className = "color-pair";
  div.innerHTML = `
    <input type="text" name="colorName" placeholder="Color name (e.g. White)" required />
    <input type="text" name="colorHex" placeholder="Hex (e.g. #fff)" required />
    <button type="button" class="remove-color-btn">&times;</button>
  `;
  div.querySelector(".remove-color-btn").addEventListener("click", () => div.remove());
  colorsContainer.appendChild(div);
  updateRemoveColorButtons();
});

function updateRemoveColorButtons() {
  const pairs = colorsContainer.querySelectorAll(".color-pair");
  pairs.forEach((pair) => {
    pair.querySelector(".remove-color-btn").style.display = pairs.length > 1 ? "inline-block" : "none";
  });
}

colorsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-color-btn")) {
    e.target.parentElement.remove();
    updateRemoveColorButtons();
  }
});

// ─── Sizes ────────────────────────────────────────────────────────────────────

addSizeBtn.addEventListener("click", () => {
  const div = document.createElement("div");
  div.className = "size-stock-pair";
  div.innerHTML = `
    <input type="text" name="size" placeholder="Size (e.g. 42)" required />
    <input type="number" name="stock" min="0" placeholder="Stock (e.g. 9)" required />
    <button type="button" class="remove-size-btn">&times;</button>
  `;
  div.querySelector(".remove-size-btn").addEventListener("click", () => div.remove());
  sizesContainer.appendChild(div);
  updateRemoveButtons();
});

function updateRemoveButtons() {
  const pairs = sizesContainer.querySelectorAll(".size-stock-pair");
  pairs.forEach((pair) => {
    pair.querySelector(".remove-size-btn").style.display = pairs.length > 1 ? "inline-block" : "none";
  });
}

sizesContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-size-btn")) {
    e.target.parentElement.remove();
    updateRemoveButtons();
  }
});

// ─── Slug auto-generate ───────────────────────────────────────────────────────

nameInput.addEventListener("input", () => {
  slugInput.value = nameInput.value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
});

// ─── Form submit ──────────────────────────────────────────────────────────────

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const brand = document.getElementById("brand").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const description = document.getElementById("description").value.trim();
  const dropAt = document.getElementById("dropAt").value;
  const dropEnd = document.getElementById("dropEnd").value;

  const colorPairs = Array.from(colorsContainer.querySelectorAll(".color-pair")).map((pair) => ({
    name: pair.querySelector('input[name="colorName"]').value.trim(),
    hex: pair.querySelector('input[name="colorHex"]').value.trim(),
  }));

  const sizePairs = Array.from(sizesContainer.querySelectorAll(".size-stock-pair"))
    .map((pair) => {
      const size = pair.querySelector('input[name="size"]').value.trim();
      const stockStr = pair.querySelector('input[name="stock"]').value.trim();
      const stock = stockStr === "" ? NaN : Number(stockStr);
      return size && !isNaN(stock) ? { size, stock } : null;
    })
    .filter(Boolean);

  if (sizePairs.length === 0) {
    alert("Please add at least one valid size and stock.");
    return;
  }

  const imagesInput = document.getElementById("images");
  const files = imagesInput.files;

  if (files.length > 4) {
    alert("You can upload a maximum of 4 images.");
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  for (let file of files) {
    if (!allowedTypes.includes(file.type)) {
      alert("Only jpg, jpeg, png, webp, and svg files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Each image must be 5MB or less.");
      return;
    }
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("brand", brand);
  formData.append("price", price);
  formData.append("description", description);
  formData.append("dropAt", dropAt);
  formData.append("dropEnd", dropEnd);
  formData.append("colors", JSON.stringify(colorPairs));
  formData.append("sizes", JSON.stringify(sizePairs));
  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }

  try {
    if (editingProductId) {
      await updateProduct(editingProductId, formData);
      editingProductId = null;
      document.getElementById("submitBtn").textContent = "Create Product";
    } else {
      await createProduct(formData, true);
    }
    form.reset();
    productModal.style.display = "none";
    loadProducts();
  } catch (err) {
    alert(err.message || "Failed to save product");
  }
});

// ─── Load products ────────────────────────────────────────────────────────────

async function loadProducts() {
  tbody.innerHTML = "<tr><td colspan='7'>Loading...</td></tr>";
  try {
    const products = await getProducts();

    if (products.length === 0) {
      tbody.innerHTML = "<tr><td colspan='7'>No products yet.</td></tr>";
      return;
    }

    tbody.innerHTML = products.map((p, idx) => {
      const sizesHtml = Array.isArray(p.sizes) && p.sizes.length > 0
        ? `<div class="sizes-list">${p.sizes.map((s) => `<span class="size-pill">${s.size} <span class="stock">(${s.stock})</span></span>`).join(" ")}</div>`
        : "<em>No sizes</em>";

      let imgUrl = "";
      if (Array.isArray(p.images) && p.images.length > 0) {
        imgUrl = typeof p.images[0] === "string" ? p.images[0] : p.images[0].url || p.images[0].path || "";
      }

      return `
        <tr>
          <td><img src="${imgUrl}" alt="${p.name}" style="max-width:60px;max-height:60px;border-radius:8px;border:1px solid #ccc;background:#fafafa;"></td>
          <td>${p.name}</td>
          <td>SEK ${Number(p.price).toFixed(2)}</td>
          <td>${sizesHtml}</td>
          <td>${p.dropAt ? p.dropAt.slice(0, 10) : "-"}</td>
          <td>${p.dropEnd ? p.dropEnd.slice(0, 10) : "-"}</td>
          <td>${p.dropStatus || "-"}</td>
          <td>
            <div style="display:flex;gap:8px;justify-content:center;align-items:center;">
              <button class="edit-product-btn admin-action-btn" data-idx="${idx}"><i class="fa fa-edit"></i> Edit</button>
              <button class="delete-product-btn admin-action-btn admin-delete-btn" data-idx="${idx}"><i class="fa fa-trash"></i> Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Populate brand filter
    const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
    const filterBrand = document.getElementById("filterBrand");
    filterBrand.innerHTML = '<option value="">All Brands</option>';
    brands.forEach((brand) => {
      filterBrand.innerHTML += `<option value="${brand.toLowerCase()}">${brand}</option>`;
    });

    // Edit buttons
    document.querySelectorAll(".edit-product-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        populateFormForEdit(products[btn.getAttribute("data-idx")]);
      });
    });

    // Delete buttons
    document.querySelectorAll(".delete-product-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const product = products[btn.getAttribute("data-idx")];
        if (await showConfirm("Delete product", `Are you sure you want to delete '${product.name}'? This cannot be undone.`)) {
          try {
            await deleteProduct(product.slug);
            loadProducts();
          } catch (err) {
            alert(err.message || "Failed to delete product");
          }
        }
      });
    });

  } catch (err) {
    tbody.innerHTML = "<tr><td colspan='7'>Failed to load products.</td></tr>";
    console.error("Failed to load products:", err);
  }
}

// ─── Populate form for edit ───────────────────────────────────────────────────

function populateFormForEdit(product) {
  document.getElementById("name").value = product.name || "";
  document.getElementById("brand").value = product.brand || "";
  document.getElementById("price").value = product.price || "";
  document.getElementById("description").value = product.description || "";
  document.getElementById("dropAt").value = product.dropAt ? product.dropAt.slice(0, 10) : "";
  document.getElementById("dropEnd").value = product.dropEnd ? product.dropEnd.slice(0, 10) : "";
  document.getElementById("slug").value = product.slug || "";
  document.getElementById("modalTitle").textContent = "Update Product";
  document.getElementById("submitBtn").textContent = "Update Product";

  colorsContainer.innerHTML = "";
  if (Array.isArray(product.colors) && product.colors.length > 0) {
    product.colors.forEach((c) => {
      const div = document.createElement("div");
      div.className = "color-pair";
      div.innerHTML = `
        <input type="text" name="colorName" placeholder="Color name (e.g. White)" required value="${c.name || ""}" />
        <input type="text" name="colorHex" placeholder="Hex (e.g. #fff)" required value="${c.hex || ""}" />
        <button type="button" class="remove-color-btn">&times;</button>
      `;
      div.querySelector(".remove-color-btn").addEventListener("click", () => div.remove());
      colorsContainer.appendChild(div);
    });
  } else {
    addColorBtn.click();
  }

  sizesContainer.innerHTML = "";
  if (Array.isArray(product.sizes) && product.sizes.length > 0) {
    product.sizes.forEach((s) => {
      const div = document.createElement("div");
      div.className = "size-stock-pair";
      div.innerHTML = `
        <input type="text" name="size" placeholder="Size (e.g. 42)" required value="${s.size || ""}" />
        <input type="number" name="stock" min="0" placeholder="Stock (e.g. 9)" required value="${s.stock ?? ""}" />
        <button type="button" class="remove-size-btn">&times;</button>
      `;
      div.querySelector(".remove-size-btn").addEventListener("click", () => div.remove());
      sizesContainer.appendChild(div);
    });
  } else {
    addSizeBtn.click();
  }

  editingProductId = product.slug;
  productModal.style.display = "flex";
}

// ─── Preview ──────────────────────────────────────────────────────────────────

function initPreview() {
  const previewImage = document.getElementById("previewImage");
  const previewBrand = document.getElementById("previewBrand");
  const previewName = document.getElementById("previewName");
  const previewPrice = document.getElementById("previewPrice");
  const nameEl = document.getElementById("name");
  const brandEl = document.getElementById("brand");
  const priceEl = document.getElementById("price");
  const imagesEl = document.getElementById("images");

  function updatePreview() {
    previewName.textContent = nameEl.value;
    previewBrand.textContent = brandEl.value;
    previewPrice.textContent = priceEl.value ? `SEK ${Number(priceEl.value).toFixed(2)}` : "";
    if (imagesEl.files && imagesEl.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };
      reader.readAsDataURL(imagesEl.files[0]);
    } else {
      previewImage.src = "";
      previewImage.style.display = "none";
    }
  }

  nameEl.addEventListener("input", updatePreview);
  brandEl.addEventListener("input", updatePreview);
  priceEl.addEventListener("input", updatePreview);
  imagesEl.addEventListener("change", updatePreview);
  updatePreview();
}


// ─── Admin ─────────────────────────────────────────────────────────────────────
async function loadUsers() {
  const usersTableBody = document.getElementById("usersTableBody");
  usersTableBody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";
  try {
    const users = await getUsers();
    if (users.length === 0) {
      usersTableBody.innerHTML = "<tr><td colspan='5'>No users yet.</td></tr>";
      return;
    }

    console.log(users)

    usersTableBody.innerHTML = users.map((u) => `
      <tr>
        <td>${u.name || "-"} ${u.lastName || "-"}</td>
        <td>${u.email || "-"}</td>
        <td>${u.role || "-"}</td>
        <td>${u.isActive ? "Active" : "Inactive"}</td>
        <td>
          <div style="display:flex;gap:8px;align-items:center;">
            ${u.isActive
              ? `<button class="deactivate-user-btn admin-action-btn admin-delete-btn" data-id="${u.id}"><i class="fa fa-ban"></i> Deactivate</button>`
              : `<button class="reactivate-user-btn admin-action-btn" data-id="${u.id}"><i class="fa fa-check"></i> Reactivate</button>`
            }
            ${u.role !== "admin"
              ? `<button class="make-admin-btn admin-action-btn" data-id="${u.id}"><i class="fa fa-shield"></i> Make Admin</button>`
              : `<button class="remove-admin-btn admin-action-btn admin-delete-btn" data-id="${u.id}"><i class="fa fa-shield"></i> Remove Admin</button>`
}
            <button class="delete-user-btn admin-action-btn admin-delete-btn" data-id="${u.id}"><i class="fa fa-trash"></i> Delete</button>
          </div>
        </td>
      </tr>
    `).join("");

    // Deactivate
    document.querySelectorAll(".deactivate-user-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (await showConfirm("Deactivate user","Are you sure you want to deactivate this user?")) {
          try {
            await deactivateUser(btn.dataset.id);
            loadUsers();
          } catch (err) {
            alert(err.message || "Failed to deactivate user");
          }
        }
      });
    });

    // Reactivate
    document.querySelectorAll(".reactivate-user-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          await reactivateUser(btn.dataset.id);
          loadUsers();
        } catch (err) {
          alert(err.message || "Failed to reactivate user");
        }
      });
    });

    // Make admin
    document.querySelectorAll(".make-admin-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (await showConfirm("Make admin", "Are you sure you want to make this user an admin?")) {
          try {
            await makeAdmin(btn.dataset.id);
            loadUsers();
          } catch (err) {
            alert(err.message || "Failed to make user admin");
          }
        }
      });
    });

    //Remove admin
    document.querySelectorAll(".remove-admin-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
        if (await showConfirm("Remove admin", "Are you sure you want to remove admin rights from this user?")) {
          try {
            await removeAdmin(btn.dataset.id);
            loadUsers();
          } catch (err) {
            alert(err.message || "Failed to remove admin");
          }
        }
      });
    });

    // Permanent delete
    document.querySelectorAll(".delete-user-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (await showConfirm("Delete user", "Are you sure you want to permanently delete this user? This cannot be undone.")) {
          try {
            await deleteUserPermanent(btn.dataset.id);
            loadUsers();
          } catch (err) {
            alert(err.message || "Failed to delete user");
          }
        }
      });
    });

  } catch (err) {
    usersTableBody.innerHTML = "<tr><td colspan='5'>Failed to load users.</td></tr>";
    console.error("Failed to load users:", err);
  }
}

async function loadOrders() {
  const ordersTableBody = document.getElementById("ordersTableBody");
  ordersTableBody.innerHTML = "<tr><td colspan='7'>Loading...</td></tr>";
  try {
    const orders = await getAllOrders();

    if (orders.length === 0) {
      ordersTableBody.innerHTML = "<tr><td colspan='7'>No orders yet.</td></tr>";
      return;
    }

    ordersTableBody.innerHTML = orders.map((o) => `
      <tr>
        <td>${o._id || o.id}</td>
        <td>${o.user?.email || o.user || "-"}</td>
        <td>${o.items?.length || 0} item(s)</td>
        <td>SEK ${Number(o.orderTotal).toFixed(2)}</td>
        <td>
          <select class="order-status-select" data-id="${o._id || o.id}">
            <option value="Pending" ${o.orderStatus === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Confirmed" ${o.orderStatus === "Confirmed" ? "selected" : ""}>Confirmed</option>
            <option value="Shipped" ${o.orderStatus === "Shipped" ? "selected" : ""}>Shipped</option>
            <option value="Delivered" ${o.orderStatus === "Delivered" ? "selected" : ""}>Delivered</option>
            <option value="Cancelled" ${o.orderStatus === "Cancelled" ? "selected" : ""}>Cancelled</option>
          </select>
        </td>
        <td>${o.createdAt ? o.createdAt.slice(0, 10) : "-"}</td>
        <td>
          <button class="save-status-btn admin-action-btn" data-id="${o._id || o.id}">
            <i class="fa fa-save"></i> Save
          </button>
        </td>
      </tr>
    `).join("");

    document.querySelectorAll(".save-status-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const select = document.querySelector(`.order-status-select[data-id="${id}"]`);
        const status = select.value;
        try {
          await updateOrderStatus(id, status);
          loadOrders();
        } catch (err) {
          alert(err.message || "Failed to update order status");
        }
      });
    });

  } catch (err) {
    ordersTableBody.innerHTML = "<tr><td colspan='7'>Failed to load orders.</td></tr>";
    console.error("Failed to load orders:", err);
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", loadProducts);