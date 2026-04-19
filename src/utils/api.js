//Get base API Url
export function getBaseUrl() {
  if (window.location.hostname.includes("localhost") && false) {
    return "http://localhost:3000/";
  }
  return "https://webbshop-2026-be.vercel.app/";
}

//Temp: Base URL is fake data
// function getBaseUrl() {
//   return "http://localhost:3000/";
// }

//Get product data from the API
export async function getProducts() {
  const url = new URL("products", getBaseUrl());

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
}

//Get product data from the API for a single product
export async function getProduct(id) {
  const url = new URL(`products/${id}`, getBaseUrl()).toString();

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

//Get variants data from the API
export async function getVariants() {
  const url = new URL("variants", getBaseUrl());

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
}

//Get variant data from the API for a single product
export async function getVariant(productId) {
  const url = new URL(`variants/${productId}`, getBaseUrl());
  // url.searchParams.append("productId", productId);

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return null;
  }
}

//Delete variant data in the API
export async function deleteVariant(id) {
  const url = new URL(`admin/variants/${id}`, getBaseUrl()).toString();
  const token = localStorage.getItem("token");

  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting variant:", error);
    return null;
  }
}

//Get user data from the API
export async function getUsers() {
  const url = new URL("admin/users", getBaseUrl());
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
}

//Get current user's data
export async function getMe() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const url = new URL("users/me", getBaseUrl()).toString();

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user:",
      error.response?.data || error.message,
    );

    // optional: clear invalid token
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return null;
  }
}

//Get order data from the API
export async function getOrders() {
  const url = new URL("admin/orders", getBaseUrl());
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
}

//Port order data to the API
export async function postOrder(order) {
  const url = new URL("orders", getBaseUrl()).toString();
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(url, order, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Full error response:", error.response?.data);
    return null;
  }
}

// Get user's personal orders from the API
export async function getMyOrders() {
  const url = new URL("orders/me", getBaseUrl());
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
}

//Create product data in the API
export async function addProduct(product) {
  const url = new URL("admin/products", getBaseUrl()).toString();
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(url, product, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
}

//Update product data in the API
export async function updateProduct(id, data) {
  const url = new URL(`admin/products/${id}`, getBaseUrl()).toString();
  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
}

//Create variant data in the API
export async function addVariant(variant) {
  const url = new URL("admin/variants", getBaseUrl()).toString();
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(url, variant, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
}

//Update variant data in the API
export async function updateVariant(id, data) {
  const url = new URL(`admin/variants/${id}/stock`, getBaseUrl()).toString();
  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
}

// Register new user
export async function registerUser(name, email, password) {
  const url = new URL("auth/register", getBaseUrl()).toString();

  try {
    const response = await axios.post(url, {
      name,
      email,
      password,
      isAdmin: false,
    });

    return response.data;
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
}

// Login user
export async function loginUser(email, password) {
  const url = new URL("auth/login", getBaseUrl()).toString();

  try {
    const response = await axios.post(url, {
      email,
      password,
    });
    console.log({ email, password });

    return response.data; // { token, user }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

//Update user data in the API
export async function updateUser(userID, data) {
  const url = new URL(`users/${userID}`, getBaseUrl()).toString();
  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

//add item to wishlist
export async function addWishlist(productId, variantId) {
  const url = new URL(`/users/me/wishlist`, getBaseUrl()).toString();
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      url,
      {
        product: productId,
        variant: variantId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message,
    );
    return null;
  }
}

//API: remove item from wishlist
// export async function removeFromWishlist(token, productId, variantId) {
//   const url = new URL("users/me/wishlist", getBaseUrl().toString());
//   try {
//     const response = await axios.delete(url, {
//       headers: { Authorization: `Bearer ${token}`},
//       data: { product: productId, variant: variantId }
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error removing from wishlist:", error);
//     return null;
//   }
// }

export async function updateOrder(id, data) {
  const url = new URL(`orders/${id}`, getBaseUrl()).toString();

  try {
    const response = await axios.patch(url, data);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    return null;
  }
}

export async function flagUser(id, isFlagged) {
  const url = new URL(`users/${id}`, getBaseUrl()).toString();

  try {
    const response = await axios.patch(url, { isFlagged });
    return response.data;
  } catch (error) {
    console.error("Error flagging user:", error);
    return null;
  }
}
