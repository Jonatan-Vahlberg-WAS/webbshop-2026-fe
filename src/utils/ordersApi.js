import { getBaseUrl } from "./api.js";

export async function createOrder(orderData) {
  const token = localStorage.getItem("token");
  const url = new URL("orders", getBaseUrl());
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (response.ok) {
    return response.json();
  }

  const err = await response.json().catch(() => ({}));
  console.log("Fel från backend:", err);

  const errorMessage =
    err.errors?.[0]?.message || err.message || "Failed to create order";

  throw new Error(errorMessage);
}

export async function getOrderById(orderId) {
  const token = localStorage.getItem("token");

  const url = new URL(`orders/${orderId}`, getBaseUrl());

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return response.json();
  }

  const err = await response.json().catch(() => ({}));
  console.log("Fel från backend:", err);

  const errorMessage =
    err.errors?.[0]?.message || err.message || "Failed to fetch order";

  throw new Error(errorMessage);
}

export async function getOrdersByUser() {
  const token = localStorage.getItem("token")
  const payload = JSON.parse(atob(token.split(".")[1]))

  const url = new URL(`orders/user/${payload.userId}`, getBaseUrl())

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })

  if(response.ok) {
    return response.json()
  }

  const err = await response.json().catch(() => ({}))
  const errorMessage = err.errors?.[0]?.message || err.message || "Failed to fetch orders"
  throw new Error(errorMessage)
}

//Admin panel
export async function getAllOrders() {
  const url = new URL("orders", getBaseUrl());
  const token = localStorage.getItem("token");
  console.log("getAllOrders url:", url.toString()); // 👈
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
    console.log("getAllOrders status:", response.status); // 👈
  if (response.ok) return response.json();
  const err = await response.json().catch(() => ({}));
    console.log("getAllOrders error:", err); // 👈
  throw new Error(err.error || "Failed to get orders");
}

export async function updateOrderStatus(id, status) {
  const url = new URL(`orders/${id}/status`, getBaseUrl());
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (response.ok) return response.json();
  const err = await response.json().catch(() => ({}));
  throw new Error(err.error || "Failed to update order status");
}