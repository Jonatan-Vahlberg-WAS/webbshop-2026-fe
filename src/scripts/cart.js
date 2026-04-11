import { getProducts, getVariants, postOrder } from "../utils/api.js";
import { getCurrentUser } from "../utils/auth.js";
import { checkIfUserHasAddress } from "../utils/utility.js";

//Function render cart products in the cart page
async function renderCart() {
  let subtotal = 0;

  try {
    const user = getCurrentUser();
    const cart = (JSON.parse(localStorage.getItem("cart")) || []).filter(
      (item) => item.userId === user.id,
    );
    const products = await getProducts();
    const variants = await getVariants();
    const cartContainer = document.querySelector(".cart-container");

    if (cart) {
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
        imgDiv.classList.add("product-img");
        const img = document.createElement("img");
        const namePriceContainer = document.createElement("div");
        namePriceContainer.classList.add("product-row");
        const name = document.createElement("span");
        name.classList.add("product-name");
        const price = document.createElement("span");
        price.classList.add("product-price");
        const size = document.createElement("p");
        size.classList.add("product-size");
        const removeItemBtn = document.createElement("button");
        removeItemBtn.innerText = "Remove Item";

        img.src = product.image;
        name.textContent = product.name;
        price.textContent = `$${product.price}`;
        size.textContent = `Size: ${variant.size} US`;

        imgDiv.append(img);
        namePriceContainer.append(name, price);
        cartItem.append(imgDiv, namePriceContainer, size, removeItemBtn);

        cartContainer.append(cartItem);

        subtotal += product.price;

        removeItemBtn.addEventListener("click", () => {
          let cart = JSON.parse(localStorage.getItem("cart")) || [];

          // Remove the clicked item (match both productId + size)
          const user = getCurrentUser();

          cart = cart.filter(
            (cartItem) =>
              !(
                cartItem.userId === user.id &&
                cartItem.productId === item.productId &&
                cartItem.size === item.size
              ),
          );

          localStorage.setItem("cart", JSON.stringify(cart));

          // Re-render cart
          cartContainer.innerHTML = "";
          renderCart();
        });
      });
    } else {
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
  if (!country.value) {
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

async function createOrder() {
  //Validates, if false stops user from ordering.
  const isValid = validateInputs();
  if (!isValid) return;

  try {
    const user = getCurrentUser();
    const cart = (JSON.parse(localStorage.getItem("cart")) || []).filter(
      (item) => item.userId === user.id,
    );
    //If cart is empty
    if (!cart || cart.length === 0) {
      console.error("Cart is empty");
      return;
    }

    const products = await getProducts();
    const variants = await getVariants();

    const productDetails = cart.map((item) => {
      const product = products.find((p) => p._id === item.productId);
      const variant = variants.find((v) => v._id === item.variantId);

      if (!product || !variant) {
        throw new Error("Invalid cart item");
      }

      return {
        productId: item.productId,
        variantId: item.variantId,
        name: product.name,
        size: variant.size,
        price: product.price,
      };
    });

    //To get total price
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const taxRate = 0.25;
    const taxes = subtotal * taxRate;
    const totalCost = subtotal + taxes;

    //Get address that is saved for user or from inputs
    let address = null;

    if (user.address) {
      address = user.address;
    } else {
      address = {
        street: document.querySelector(".street-input").value,
        city: document.querySelector(".city-input").value,
        postalCode: document.querySelector(".postal-code-input").value,
        country: document.querySelector(".country-input").value,
      };
    }

    const order = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userAddress: address,
      products: productDetails,
      quantity: cart.length,
      totalCost,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error(err);
  }
}

const confirmPurchaseBtn = document.querySelector(".confirm-btn");
confirmPurchaseBtn.addEventListener("click", () => {});
