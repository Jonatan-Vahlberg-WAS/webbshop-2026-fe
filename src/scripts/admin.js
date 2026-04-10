import {
  getProducts,
  getVariants,
  getUsers,
  getOrders,
  addProduct,
  addVariant,
  updateProduct,
  updateVariant 
} from "../utils/api.js";
import { generateObjectId } from "../utils/utility.js";


let editingProductId = null; 
let cancelEditBtn = document.createElement("button");
cancelEditBtn.innerText = "Cancel";
cancelEditBtn.type = "button";
cancelEditBtn.style.display = "none";

//Function that fetches all data, instead of having to fetch data in each render function
async function fetchData() {
  const products = await getProducts();
  const variants = await getVariants();
  const users = await getUsers();
  const orders = await getOrders();

  return { products, variants, users, orders };
}

//Function to view all products
function renderProductTable(products, variants) {
  const productList = document.querySelector(".admin-products-tbody");

  productList.innerHTML = "";

  const sortedVariants = [...variants].sort((a, b) => {
    const productA = products.find((p) => p._id === a.productId);
    const productB = products.find((p) => p._id === b.productId);

    const nameCompare = productA.name.localeCompare(productB.name);
    if (nameCompare !== 0) return nameCompare;

    return Number(a.size) - Number(b.size);
  });

  sortedVariants.forEach((variant) => {
    const product = products.find((p) => p._id === variant.productId);

    const tr = document.createElement("tr");
    const name = document.createElement("th");
    const price = document.createElement("th");
    const size = document.createElement("th");
    const stock = document.createElement("th");
    const dropStatus = document.createElement("th");
    const actions = document.createElement("th");

    name.innerText = product.name;
    price.innerText = `$${product.price}`;
    size.innerText = variant.size;
    dropStatus.innerText = product.status;

    // Stock color helper
    const getStockColor = (value) => {
      if (value === 0) return "red";
      else if (value <= 5) return "orange";
      else return "green";
    };

    // Stock span with text color
    const stockText = document.createElement("span");
    stockText.innerText = variant.stock;
    stockText.style.color = getStockColor(variant.stock);
    stock.appendChild(stockText);

    // btn Update stock
    const updateStockBtn = document.createElement("button");
    updateStockBtn.innerText = "Update Stock";
    updateStockBtn.style.backgroundColor = "#DEED00";
    updateStockBtn.style.color = "black";

    let stockInput = null;

    updateStockBtn.addEventListener("click", async () => {

      if (updateStockBtn.innerText.toLowerCase() === "update stock") {
        stockInput = document.createElement("input");
        stockInput.type = "number";
        stockInput.min = "0";
        stockInput.value = parseInt(stockText.innerText);
        stockInput.style.width = "100px";

        stock.replaceChild(stockInput, stockText);
        updateStockBtn.innerText = "Save Stock";

      } else {
        const newStock = parseInt(stockInput.value);

        if (isNaN(newStock) || newStock < 0) {
          alert("Stock must be a non-negative number");
          return;
        }

        await updateVariant(variant.id, { stock: newStock });

        stockText.innerText = newStock;
        stockText.style.color = getStockColor(newStock);
        stock.replaceChild(stockText, stockInput);
        updateStockBtn.innerText = "Update Stock";
      }
    });

    // Edit product button
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit Product";
    editBtn.style.backgroundColor = "black";
    editBtn.style.color = "white";

    editBtn.addEventListener("click", () => {
      const formTitle = document.querySelector(".create-product h2");

      editingProductId = product._id;

      document.querySelector("#name").value = product.name;
      document.querySelector("#description").value = product.description;
      document.querySelector("#price").value = product.price;
      document.querySelector("#image").value = product.image;
      cancelEditBtn.style.display = "inline-block";

      const date = new Date(product.dropDate);
      document.querySelector("#release-date").value =
        date.toISOString().slice(0, 16);

      formTitle.innerText = "Edit Product";
      document.querySelector("#create-product-btn").innerText = "Update Product";
    });

    const statusBtn = document.createElement("button");
    if (product.status === "upcoming") {
      statusBtn.innerText = "Go Live";
      statusBtn.style.backgroundColor = "green";
      statusBtn.style.color = "white";

      statusBtn.addEventListener("click", async () => {
        await updateProduct({ ...product, status: "live" });
        await onPageLoad();
      });

      actions.append(editBtn, updateStockBtn, statusBtn);

    } else if (product.status === "live") {
      statusBtn.innerText = "Mark Sold Out";
      statusBtn.style.backgroundColor = "orange";
      statusBtn.style.color = "white";

      statusBtn.addEventListener("click", async () => {
        await updateProduct({ ...product, status: "sold out" });
        await onPageLoad();
      });

      actions.append(editBtn, updateStockBtn, statusBtn);

    } else {
      // sold out — show Go Live button
      statusBtn.innerText = "Go Live";
      statusBtn.style.backgroundColor = "green";
      statusBtn.style.color = "white";

      statusBtn.addEventListener("click", async () => {
        await updateProduct({ ...product, status: "live" });
        await onPageLoad();
      });

      actions.append(editBtn, updateStockBtn, statusBtn);
    }

    tr.append(name, price, size, stock, dropStatus, actions);
    productList.append(tr);
  });
}

//function to view all users
function renderUserTable(users, orders) {
  const userList = document.querySelector(".admin-user-tbody");

  const onlyUsers = users.filter((u) => u.isAdmin === false);

  onlyUsers.forEach((user) => {
    const userOrders = orders.filter((o) => o.userId === user._id);

    const tr = document.createElement("tr");
    const name = document.createElement("th");
    const email = document.createElement("th");
    const numOfOrders = document.createElement("th");
    const Actions = document.createElement("th");

    name.innerText = user.name;
    email.innerText = user.email;
    numOfOrders.innerText = userOrders.length;

    const flagBtn = document.createElement("button");
    flagBtn.innerText = "Flag";
    const viewOrdersBtn = document.createElement("button");
    viewOrdersBtn.innerText = "View Orders";
    Actions.append(viewOrdersBtn, flagBtn);

    tr.append(name, email, numOfOrders, Actions);
    userList.append(tr);
  });
}

//function to view all orders
function renderOrderTable(products, variants, users, orders) {
  const orderList = document.querySelector(".admin-order-tbody");

  orders.forEach((order) => {
    const orderProduct = products.find((p) => p._id === order.productId);
    const orderSize = variants.find((v) => v._id === order.variantId);
    const orderUser = users.find((u) => u._id === order.userId);

    const tr = document.createElement("tr");
    const orderId = document.createElement("th");
    const userName = document.createElement("th");
    const productName = document.createElement("th");
    const productSize = document.createElement("th");
    const price = document.createElement("th");
    const status = document.createElement("th");
    const Actions = document.createElement("th");

    orderId.innerText = order._id;
    userName.innerText = orderUser.name;
    productName.innerText = orderProduct.name;
    productSize.innerText = orderSize.size;
    price.innerText = `$${orderProduct.price}`;
    status.innerText = order.status;

    const updateStatusBtn = document.createElement("button");
    updateStatusBtn.innerText = "Update Status";
    const refundBtn = document.createElement("button");
    refundBtn.innerText = "Refund";
    Actions.append(updateStatusBtn, refundBtn);

    tr.append(orderId, userName, productName, productSize, price, status, Actions);
    orderList.append(tr);
  });
}

//Function that shows stats
function renderStats(products, orders) {
  const VAT_RATE = 0.25;
  const netRevenue = orders.reduce((sum, order) => {
    const product = products.find((p) => p._id === order.productId);
    return sum + Number(product.price) / (1 + VAT_RATE);
  }, 0);
  const activeProducts = products.filter((p) => p.status === "live");
  const shipped = orders.filter((o) => o.status === "shipped");
  const pending = orders.filter((o) => o.status === "pending");

  const totalRevenue = document.querySelector(".stat-revenue");
  const activeDrops = document.querySelector(".stat-active-drops");
  const totalOrders = document.querySelector(".stat-total-orders");
  const shippedOrders = document.querySelector(".stat-shipped-orders");
  const pendingOrders = document.querySelector(".stat-pending-orders");

  totalRevenue.innerText = `$ ${netRevenue}`;
  activeDrops.innerText = activeProducts.length;
  totalOrders.innerText = orders.length;
  shippedOrders.innerText = shipped.length;
  pendingOrders.innerText = pending.length;
}

//Fetches all data and runs render functions when the page loads
async function onPageLoad() {
  const { products, variants, users, orders } = await fetchData();

  renderProductTable(products, variants);
  renderUserTable(users, orders);
  renderOrderTable(products, variants, users, orders);
  renderStats(products, orders);
  renderProductSelect(products);

  const form = document.querySelector(".create-product-form");
  form.append(cancelEditBtn);
  cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cancelEdit();
  });
}

onPageLoad();

// Function that creates a product
async function createProduct() {
  const name = document.querySelector("#name");
  const description = document.querySelector("#description");
  const price = document.querySelector("#price");
  const imageURL = document.querySelector("#image");
  const releaseDate = document.querySelector("#release-date");
  const id = generateObjectId();

  let emptyFields = [];
  let otherErrors = [];

  if (!name.value.trim()) {
    emptyFields.push("Name");
    name.style.border = "1px solid red";
  }
  if (!description.value.trim()) {
    emptyFields.push("Description");
    description.style.border = "1px solid red";
  }
  if (!price.value) {
    emptyFields.push("Price");
    price.style.border = "1px solid red";
  }
  if (!imageURL.value.trim()) {
    emptyFields.push("Image URL");
    imageURL.style.border = "1px solid red";
  }
  if (!releaseDate.value) {
    emptyFields.push("Release Date & Time");
    releaseDate.style.border = "1px solid red";
  }

  if (price.value && Number(price.value) < 0) {
    otherErrors.push("Price must be positive");
    price.style.border = "1px solid red";
  }

  let messages = [];
  if (emptyFields.length > 0) {
    messages.push(
      `${emptyFields.join(" & ")} ${emptyFields.length === 1 ? "field is" : "fields are"} empty`,
    );
  }
  messages = messages.concat(otherErrors);

  if (messages.length > 0) {
    const errorMsg = document.querySelector(".product-error-message");
    errorMsg.classList.add("product-error-msg");
    errorMsg.innerText = messages.join(" & ");
    return;
  }

  const product = {
    _id: id,
    name: name.value,
    description: description.value,
    price: Number(price.value),
    image: imageURL.value,
    dropDate: new Date(releaseDate.value).toISOString(),
    status: "upcoming",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  };

  await addProduct(product);
  alert("Product created! Please add at least one size & stock.");
  
  await onPageLoad();
  document.querySelector(".create-product-form").reset();
}

//button event listener for create product
const createProductBtn = document.querySelector("#create-product-btn");

function cancelEdit() {
  editingProductId = null;

  document.querySelector(".create-product-form").reset();

  document.querySelector(".create-product h2").innerText = "Create Product";
  document.querySelector("#create-product-btn").innerText = "Create Product";

  cancelEditBtn.style.display = "none";
}

//edit product function
async function editProduct() {
  const name = document.querySelector("#name");
  const description = document.querySelector("#description");
  const price = document.querySelector("#price");
  const imageURL = document.querySelector("#image");
  const releaseDate = document.querySelector("#release-date");

  if (!editingProductId) return;

  const products = await getProducts();
  const existingProduct = products.find(p => p._id === editingProductId);
  if (!existingProduct) return;

  if (!name.value.trim() || !price.value) {
    const errorMsg = document.querySelector(".product-error-message");
    errorMsg.innerText = "Name and Price are required";
    return;
  }

  const product = {
    ...existingProduct,
    name: name.value,
    description: description.value,
    price: Number(price.value),
    image: imageURL.value,
    dropDate: new Date(releaseDate.value).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await updateProduct(product);

  editingProductId = null;

  document.querySelector(".create-product h2").innerText = "Create Product";
  document.querySelector("#create-product-btn").innerText = "Create Product";

  await onPageLoad();
  document.querySelector(".create-product-form").reset();
}

async function handleProductSubmit() {
  if (editingProductId) {
    await editProduct();
  } else {
    await createProduct();
  }
}

createProductBtn.addEventListener("click", () => {
  handleProductSubmit();
});

//Render all products so admin can choose which product to add variants to
function renderProductSelect(products) {
  const productSelect = document.querySelector("#choose-product");

  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product._id;
    option.innerText = product.name;
    productSelect.append(option);
  });
}

//Function to create variant
async function createVariant() {
  const size = document.querySelector("#size");
  const stock = document.querySelector("#stock");
  const productSelect = document.querySelector("#choose-product");
  const id = generateObjectId();

  const variants = await getVariants();

  let emptyFields = [];
  let otherErrors = [];

  if (!size.value) {
    emptyFields.push("Size");
    size.style.border = "1px solid red";
  }
  if (!stock.value) {
    emptyFields.push("Stock");
    stock.style.border = "1px solid red";
  }

  if (size.value && Number(size.value) < 0) {
    otherErrors.push("Size must be positive");
    size.style.border = "1px solid red";
  }
  if (stock.value && Number(stock.value) < 0) {
    otherErrors.push("Stock must be positive");
    stock.style.border = "1px solid red";
  }
  if (Number(stock.value) === 0) {
    otherErrors.push("Stock cannot be 0");
    stock.style.border = "1px solid red";
  }

  const sizeExists = variants.some(
    (v) =>
      v.productId === productSelect.value &&
      Number(v.size) === Number(size.value),
  );

  if (sizeExists) {
    otherErrors.push("This size already exists for the selected product");
    size.style.border = "1px solid red";
  }

  let messages = [];
  if (emptyFields.length > 0) {
    messages.push(
      `${emptyFields.join(" & ")} ${emptyFields.length === 1 ? "field is" : "fields are"} empty`,
    );
  }
  messages = messages.concat(otherErrors);

  if (messages.length > 0) {
    const errorMsg = document.querySelector(".variant-error-message");
    errorMsg.classList.add("product-error-msg");
    errorMsg.innerText = messages.join(" & ");
    return;
  }

  const variant = {
    _id: id,
    productId: productSelect.value,
    size: size.value,
    stock: stock.value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  };

  addVariant(variant);
}

//Create Variant button listener
const addVariantBtn = document.querySelector("#create-variant-btn");

addVariantBtn.addEventListener("click", () => {
  createVariant();
});

//For tabs rendering
const tabButtons = document.querySelectorAll(".tabs button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabContents.forEach((tab) => tab.classList.remove("active"));

    const targetTab = document.getElementById(btn.dataset.tab);
    targetTab.classList.add("active");

    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});