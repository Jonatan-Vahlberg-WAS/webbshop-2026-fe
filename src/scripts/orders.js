import { getProfile } from "../utils/userApi.js";
import { getOrdersByUser } from "../utils/ordersApi.js";
import { updateCartCount } from "../utils/cartUtils.js";
import { getProducts } from "../utils/productsApi.js";

updateCartCount();
const products = await getProducts();
const container = document.querySelector("#orders-list");

const init = async () => {
  if (!container) return;

  container.innerHTML = "<p>Loading orders...</p>";

  try {
    // Fetch user
    const profile = await getProfile();
    const userId = profile.data._id;

    // Fetch orders
    const orders = await getOrdersByUser(userId);

    if (orders.length === 0) {
      container.innerHTML = "<p>No orders found</p>";
      return;
    }

    // Render
    container.innerHTML = orders
      .map((order) => {
        const total = order.items.reduce((sum, item) => {
          return sum + item.unitPrice * item.quantity;
        }, 0);
        console.log("item.product:", order.items[0].product);
        console.log("products:", products);

        const product = products.find(
          (p) => order.items[0].product && p._id === order.items[0].product._id,
        );

        return `
        <div class="order-content">
            <div class="orders-left-side">
                <h3>Order ID: ${order._id}</h3>
                <img src="${product?.images[0]?.url}"/>
            </div>
            <div class="orders-right-side">
                <p>Status: ${order.orderStatus}</p>
                <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Total:</strong> ${total}kr</p>
                <a class="order-link" href="order-details.html?id=${order._id}">View order details</a>
            </div>
        </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Failed to load orders:", error);
    container.innerHTML = "<p>Failed to load orders</p>";
  }
};

init();
