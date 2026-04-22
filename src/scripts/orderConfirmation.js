const container = document.querySelector("#order-confirmation");

const orderData = sessionStorage.getItem("latestOrder");

if (!container) {
  console.error("No container found");
}

if (!orderData) {
  container.innerHTML = "<p>No order found.</p>";
} else {
  const order = JSON.parse(orderData);

  sessionStorage.removeItem("latestOrder");

  container.innerHTML = `
  <p><strong>Order ID:</strong> ${order._id}</p>
  <p><strong>Status:</strong> ${order.orderStatus}</p>
  <p><strong>Created:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
  <p><strong>Items:</strong> ${order.items.length}</p>
  `;
}
