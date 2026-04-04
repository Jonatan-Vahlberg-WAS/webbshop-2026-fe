import { getProducts, getVariants, getUsers, getOrders } from "../utils/api.js";

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
    const product = products.find(
      (p) => Number(p.id) === Number(variant.productId),
    );

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
    const userOrders = orders.filter(
      (o) => Number(o.userId) === Number(user.id),
    );

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
    const orderProduct = products.find(
      (p) => Number(p.id) === Number(order.productId),
    );
    const orderSize = variants.find(
      (v) => Number(v.id) === Number(order.variantId),
    );
    const orderUser = users.find((u) => Number(u.id) === Number(order.userId));

    const tr = document.createElement("tr");
    const orderId = document.createElement("th");
    const userName = document.createElement("th");
    const productName = document.createElement("th");
    const productSize = document.createElement("th");
    const price = document.createElement("th");
    const status = document.createElement("th");
    const Actions = document.createElement("th");

    orderId.innerText = order.id;
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
    const product = products.find(
      (p) => Number(p.id) === Number(order.productId),
    );

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
