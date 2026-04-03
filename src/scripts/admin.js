import { getProducts, getVariants, getUsers, getOrders } from "../utils/api.js";

//Function to view all products
async function renderProductTable() {
  const products = await getProducts();
  const variants = await getVariants();

  const productList = document.querySelector(".admin-products");

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

    const edit = document.createElement("button");
    edit.innerText = "Edit";
    actions.append(edit);

    tr.append(name, price, size, stock, dropStatus, actions);
    productList.append(tr);
  });
}

//To run all functions when the page loads
function onPageLoad() {
  renderProductTable();
}

onPageLoad();
