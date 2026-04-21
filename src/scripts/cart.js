import { getProducts, getVariants, postOrder, getMe } from "../utils/api.js";
import { getCurrentUser } from "../utils/auth.js";
import { checkIfUserHasAddress, updateCartBadge } from "../utils/utility.js";

updateCartBadge();

//Function render cart products in the cart page
async function renderCart() {
  let subtotal = 0;
  const cartContainer = document.querySelector(".cart-container");

  cartContainer.innerHTML = "";
  cartContainer.classList.remove("empty-cart");

  try {
    const user = getCurrentUser();
    const cart = (JSON.parse(localStorage.getItem("cart")) || []).filter(
      (item) => item.userId === user.userId,
    );
    const products = await getProducts();
    const variants = await getVariants();

    if (cart.length > 0) {
      cart.forEach((item) => {
        //Match the products in the cart with the database
        const product = products.find((p) => p._id === item.productId);

        const variant = variants.find(
          (v) => v.productId === item.productId && v.size === item.size,
        );

        if (!product || !variant) return;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        const imgDiv = document.createElement("div");
        imgDiv.classList.add("cart-item-img");
        const img = document.createElement("img");
        img.src = product.image;
        imgDiv.append(img);

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("cart-item-info");

        const name = document.createElement("span");
        name.classList.add("product-name");
        name.textContent = product.name;

        const size = document.createElement("span");
        size.classList.add("product-size");
        size.textContent = `Size: ${variant.size} US`;

        const removeItemBtn = document.createElement("button");
        removeItemBtn.classList.add("remove-btn");
        removeItemBtn.innerText = "Remove";

        infoDiv.append(name, size, removeItemBtn);

        const price = document.createElement("span");
        price.classList.add("product-price");
        price.textContent = `$${product.price}`;

        cartItem.append(imgDiv, infoDiv, price);
        cartContainer.append(cartItem);

        subtotal += product.price;

        removeItemBtn.addEventListener("click", () => {
          let cart = JSON.parse(localStorage.getItem("cart")) || [];

          // Remove the clicked item (match both productId + size)
          cart = cart.filter(
            (cartItem) =>
              !(
                cartItem.userId === user.userId &&
                cartItem.productId === item.productId &&
                cartItem.size === item.size
              ),
          );

          localStorage.setItem("cart", JSON.stringify(cart));

          // Re-render cart
          renderCart();
          updateCartBadge();
        });
      });
    } else {
      cartContainer.innerHTML = "";
      cartContainer.textContent = "Cart is empty";
      cartContainer.classList.add("empty-cart");
    }

    // Extract 25% VAT from total (included in price)
    const taxes = subtotal * 0.25;

    const subtotalEl = document.querySelector(".subtotal");
    const taxesEl = document.querySelector(".taxes");

    subtotalEl.textContent = `$ ${subtotal.toFixed(2)}`;
    taxesEl.textContent = `$ ${taxes.toFixed(2)}`;

    const totalWithTax = subtotal + taxes;
    const totalPrice = document.querySelector(".total-price");
    totalPrice.textContent = `$${totalWithTax.toFixed(2)}`;
  } catch (err) {
    console.error(err);
  }
}

// Only call on cart.html
if (window.location.pathname.includes("cart.html")) {
  renderCart();
  checkIfUserHasAddress("address-form", "user-address");
}

//To validate address inputs
function validateInputs() {
  const name = document.querySelector(".fullname-input");
  const street = document.querySelector(".street-input");
  const city = document.querySelector(".city-input");
  const postalCode = document.querySelector(".postal-code-input");
  const country = document.querySelector(".country-input");

  let emptyFields = [];

  if (!name.value.trim()) {
    emptyFields.push("Name");
    name.style.borderBottom = "1px solid red";
  }
  if (!street.value.trim()) {
    emptyFields.push("Street");
    street.style.borderBottom = "1px solid red";
  }
  if (!city.value.trim()) {
    emptyFields.push("City");
    city.style.borderBottom = "1px solid red";
  }
  if (!postalCode.value.trim()) {
    emptyFields.push("Postal Code");
    postalCode.style.borderBottom = "1px solid red";
  }
  if (!country.value.trim()) {
    emptyFields.push("Country");
    country.style.borderBottom = "1px solid red";
  }

  if (emptyFields.length > 0) {
    const errorMsg = document.querySelector(".cart-error-message");
    errorMsg.classList.add("cart-error-msg");
    errorMsg.innerText = `${emptyFields.join(" & ")} ${emptyFields.length === 1 ? "field is" : "fields are"} empty`;
    return false;
  }
  return true;
}

//Function that runs when confirm purchase button is pressed, creates order in backend
async function createOrder() {
  const user = getCurrentUser();
  const fullUser = await getMe();
  let isValid = true;
  //Only validate form if user has no saved address
  if (!user.address) {
    isValid = validateInputs();
  }
  if (!isValid) return;

  try {
    //Filter cart belonging to user id
    const cart = (JSON.parse(localStorage.getItem("cart")) || []).filter(
      (item) => item.userId === user.userId,
    );
    //Stops function fom running if cart is empty
    if (!cart || cart.length === 0) {
      console.error("Cart is empty");
      return;
    }

    //Get address that is saved for user or from inputs
    let address = null;

    if (user.address) {
      //Save a copy of the user address
      address = { ...user.address };
    } else {
      address = {
        name: document.querySelector(".fullname-input").value,
        street: document.querySelector(".street-input").value,
        city: document.querySelector(".city-input").value,
        postalCode: document.querySelector(".postal-code-input").value,
        country: document.querySelector(".country-input").value,
      };
    }

    const order = {
      products: cart.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: 1,
      })),
      address,
    };

    const result = await postOrder(order);

    if (!result) {
      console.error("Order failed");
      return;
    }

    console.log("Order success");

    //Clear Cart
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = existingCart.filter(
      (item) => item.userId !== user.userId,
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    renderCart();

    summaryModal(result);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err.message);
    console.error(err);
  }
}

const confirmPurchaseBtn = document.querySelector(".confirm-btn");
confirmPurchaseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  createOrder();
});

//Create modal to show order summary
function summaryModal(order) {
  const background = document.createElement("div");
  background.classList.add("order-modal-background");
  const modal = document.createElement("div");
  modal.classList.add("order-modal");

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "Close";

  closeBtn.addEventListener("click", () => {
    background.remove();
  });

  const orderNr = document.createElement("h1");
  const orderDate = document.createElement("p");

  orderNr.innerText = order._id;
  orderDate.innerText = new Date(order.createdAt).toLocaleString();

  const userInfo = document.createElement("div");
  const userName = document.createElement("p");
  const userEmail = document.createElement("p");
  const userAddress = document.createElement("p");

  userName.innerText = order.user.name;
  userEmail.innerText = order.user.email;
  const addr = order.user.address;
  userAddress.innerText = `${addr.street}, ${addr.city}, ${addr.postalCode}, ${addr.country}`;
  userInfo.append(userName, userEmail, userAddress);

  const productInfo = document.createElement("div");

  order.products.forEach((product) => {
    const productCard = document.createElement("div");

    const productImg = document.createElement("img");
    const productName = document.createElement("h2");
    const productSize = document.createElement("p");
    const productPrice = document.createElement("p");

    // productImg.src = product.image;
    productName.innerText = product.name;
    productSize.innerText = product.size;
    productPrice.innerText = `$ ${product.price}`;

    productCard.append(productImg, productName, productSize, productPrice);
    productInfo.append(productCard);
  });

  const totalPrice = document.createElement("p");
  totalPrice.innerText = `Total Cost: $ ${order.totalCost.toFixed(2)}`;

  modal.append(closeBtn, orderNr, orderDate, userInfo, productInfo, totalPrice);
  background.append(modal);
  document.body.append(background);
}
