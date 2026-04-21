import { getOrderById } from "../utils/ordersApi.js";
import { getProducts } from "../utils/productsApi.js";
import { updateCartCount } from "../utils/cartUtils.js";

console.log("script loaded");
console.log("container:", document.querySelector("#order-details"));
console.log("orderId:", new URLSearchParams(window.location.search).get("id"));

updateCartCount();

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

const container = document.querySelector("#order-details");

const init = async () => {
  if (!container) return;

  if (!orderId) {
    container.innerHTML = "<p>No order ID found</p>";
    return;
  }

  container.innerHTML = "<p>Loading order...</p>";

  try {
    const order = await getOrderById(orderId);
    const products = await getProducts();
    console.log("ORDER:", order);

    const itemsHTML = order.items
      .map((item) => {
        const productId =
          typeof item.product === "string" ? item.product : item.product._id;

        const product = products.find((p) => p._id === productId);

        return `
    <div class="order-item">
      <h4>${product?.name || "Unknown product"}</h4>
      <img src="${product?.images[0]?.url}" />
      <p>Size: ${item.size}</p>
      <p>Price: ${item.unitPrice}kr</p>
    </div>
  `;
      })
      .join("");

    const total = order.items.reduce((sum, item) => {
      return sum + item.unitPrice;
    }, 0);

    container.innerHTML = `
    <div class="order-card">
        <h3>Order ID: ${order._id}</h3>
                <p>Status: ${order.orderStatus}</p>
        <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>

        <div class="order-items">
          ${itemsHTML}
        </div>

        <p><strong>Total:</strong> ${total}kr</p>
      </div>
    `;
  } catch (error) {
    console.error("Failed to load order:", error);
    container.innerHTML = "<p>Failed to load order</p>";
  }
};

init();
