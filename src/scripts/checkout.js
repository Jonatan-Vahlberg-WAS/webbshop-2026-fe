import { getCart, updateCartCount } from "../utils/cartUtils.js";
import { createOrder } from "../utils/ordersApi.js";
import { updateWishlistCount } from "./wishlist.js";
updateWishlistCount();

const checkoutContainer = document.querySelector("#checkout-items");
const checkoutTotal = document.querySelector("#checkout-total");
const placeOrderButton = document.querySelector("#place-order-button");

const renderCheckout = () => {
  if (!checkoutContainer) {
    return;
  }
  const cart = getCart();

  if (cart.length === 0) {
    checkoutContainer.innerHTML = `<p>No items in cart</p>`;

    if (checkoutTotal) {
      checkoutTotal.textContent = "";
    }

    if (placeOrderButton) {
      placeOrderButton.disabled = true;
    }
    return;
  }

  checkoutContainer.innerHTML = cart
    .map(
      (item) => `
    <div class="checkout-item">
      <img src="${item.image}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>Size: ${item.size}</p>
      <p>Quantity: ${item.quantity}</p>
      <p>Price: ${item.price}kr</p>
    </div>
  `,
    )
    .join("");

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  if (checkoutTotal) {
    checkoutTotal.textContent = `Total: ${total}kr`;
  }

  if (placeOrderButton) {
    placeOrderButton.disabled = false;
  }
};
updateCartCount();
renderCheckout();

placeOrderButton?.addEventListener("click", async () => {
  const cart = getCart();
  if (cart.length === 0) return;

  placeOrderButton.disabled = true;
  placeOrderButton.textContent = "Placing order...";

  const orderData = {
    items: cart.map((item) => ({
      product: item.productId,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.price,
    })),
  };

  try {
    const createdOrder = await createOrder(orderData);

    sessionStorage.setItem("latestOrder", JSON.stringify(createdOrder));

    localStorage.removeItem("cart");

    window.location.href = "/order-confirmation.html";
  } catch (error) {
    console.error("Failed to place order:", error);
    placeOrderButton.disabled = false;
    placeOrderButton.textContent = "Place order";
    alert("Something went wrong. Please try again.");
  }
});
