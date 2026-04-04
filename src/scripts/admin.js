import { getProducts, getVariants, getUsers, getOrders } from "../utils/api.js";

//Function to view all products
async function renderProductTable() {
  const products = await getProducts();
  const variants = await getVariants();

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
async function renderUserTable() {
  const users = await getUsers();
  const orders = await getOrders();

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

//To run all functions when the page loads
function onPageLoad() {
  renderProductTable();
  renderUserTable();
}

onPageLoad();
