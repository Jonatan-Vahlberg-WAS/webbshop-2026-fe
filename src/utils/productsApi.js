import { getBaseUrl } from "./api.js";

export async function getProducts() {
  const url = new URL("products", getBaseUrl());
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
  return [];
}

export async function getProductBySlug(slug) {
  const url = new URL(`products/${slug}`, getBaseUrl());
  const response = await fetch(url);
  if(response.ok) {
    return response.json();
  }
  return null;
}

  export async function createProduct(product, isFormData = false) {
  const url = new URL("products", getBaseUrl());
  const token = localStorage.getItem("token");

  let headers = { Authorization: `Bearer ${token}` };
  let body = product;
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(product);
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  if (response.ok) {
    return response.json();
  }

  const err = await response.json().catch(() => ({}));
  throw new Error(
    err.details?.[0] || err.errors?.[0]?.msg || err.error || "Failed to create product"
  );
}
export async function updateProduct(slug, product) {
  try {
    const url = new URL(`products/${slug}`, getBaseUrl());
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: product,
    });

    if (response.ok) {
      return response.json();
    }

    const err = await response.json().catch(() => ({}));
    throw new Error(err.errors?.[0]?.msg || err.error || "Failed to update product");

  } catch (err) {
    console.error("updateProduct error:", err);
    throw err;
  }
}

export async function deleteProduct(slug) {
  try {
    const url = new URL(`products/${slug}`, getBaseUrl());
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      return true;
    }

    const err = await response.json().catch(() => ({}));
    throw new Error(err.errors?.[0]?.msg || err.error || "Failed to delete product");

  } catch (err) {
    console.error("deleteProduct error:", err);
    throw err;
  }
}