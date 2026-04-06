import {
  getProducts,
  getVariants,
  getUsers,
  getOrders,
  addProduct,
} from "../utils/api.js";
import { generateObjectId } from "../utils/utility.js";

//Function that fetches all data, instead of having to fetch data in each render function
async function fetchData() {
  const products = await getProducts();
  const variants = await getVariants();
  const users = await getUsers();
  const orders = await getOrders();

  return {
    products,
    variants,
    users,
    orders,
  };
}

//Function to view all products
function renderProductTable(products, variants) {
  const productList = document.querySelector(".admin-products-tbody");

  variants.forEach((variant) => {
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
    stock.innerText = variant.stock;
    dropStatus.innerText = product.status;

    //Give stock colors depending on stock value
    if (variant.stock === 0) {
      stock.style.color = "red";
    } else if (variant.stock <= 5) {
      stock.style.color = "orange"; // low stock
    } else {
      stock.style.color = "green"; // plenty in stock
    }

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    actions.append(editBtn);

    tr.append(name, price, size, stock, dropStatus, actions);
    productList.append(tr);
  });
}

//function to view all users
function renderUserTable(users, orders) {
  const userList = document.querySelector(".admin-user-tbody");

  users.forEach((user) => {
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

    tr.append(
      orderId,
      userName,
      productName,
      productSize,
      price,
      status,
      Actions,
    );
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
  const activeProducts = products.filter((p) => {
    return p.status === "live";
  });
  const shipped = orders.filter((o) => o.status === "shipped");
  const pending = orders.filter((o) => o.status === "pending");

  const totalRevenue = document.querySelector(".stat-revenue");
  const activeDrops = document.querySelector(".stat-active-drops");
  const totalOrders = document.querySelector(".stat-total-orders");
  const shippedOrders = document.querySelector(".stat-shipped-orders");
  const pendingOrders = document.querySelector(".stat-pending-orders");

  totalRevenue.innerText = netRevenue;
  activeDrops.innerText = activeProducts.length;
  totalOrders.innerText = orders.length;
  shippedOrders.innerText = shipped.length;
  pendingOrders.innerText = pending.length;
}

//Fetches all data and uses them as parameters for the render functions and runs render functions when the page loads
async function onPageLoad() {
  const { products, variants, users, orders } = await fetchData();

  renderProductTable(products, variants);
  renderUserTable(users, orders);
  renderOrderTable(products, variants, users, orders);
  renderStats(products, orders);
}

onPageLoad();

//Function that creates a product
function createProduct() {
  const name = document.querySelector("#name");
  const description = document.querySelector("#description");
  const price = document.querySelector("#price");
  const imageURL = document.querySelector("#image");
  const releaseDate = document.querySelector("#release-date");
  const id = generateObjectId();

  //Validation to make none of these are empty
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

  // Combine messages
  let messages = [];
  if (emptyFields.length > 0) {
    messages.push(
      `${emptyFields.join(" & ")} ${emptyFields.length === 1 ? "field is" : "fields are"} empty`,
    );
  }
  messages = messages.concat(otherErrors);

  // Show error
  if (messages.length > 0) {
    const errorMsg = document.querySelector(".product-error-message");
    errorMsg.classList.add("product-error-msg");
    errorMsg.innerText = messages.join(" & ");
    return;
  }

  const product = {
    //Could no have the id and _id to be similar because db.json kept creating ids and overwriting my id variable.
    _id: id,
    name: name.value,
    description: description.value,
    price: Number(price.value),
    image: imageURL.value,
    dropDate: new Date(releaseDate.value).toISOString(),
    status: "upcoming",
    createdAt: new Date().toISOString(),
    //this will need to be changed if the product is ever edited
    updatedAt: new Date().toISOString(),
    __v: 0,
  };

  addProduct(product);
}

const createProductBtn = document.querySelector("#create-product-btn");

createProductBtn.addEventListener("click", () => {
  createProduct();
});
