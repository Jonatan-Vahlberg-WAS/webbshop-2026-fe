//Get base API Url
// export function getBaseUrl() {
//   if (window.location.hostname.includes("localhost") && false) {
//     return "http://localhost:3000/";
//   }
//   return "https://webbshop-2026-be.vercel.app/";
// }

//Temp: Base URL is fake data
function getBaseUrl() {
  return "http://localhost:3000/";
}

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
  const url = new URL("variants", getBaseUrl());
  url.searchParams.append("productId", productId);

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
  const url = new URL(`variants/${id}`, getBaseUrl()).toString();

  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error deleting variant:", error);
    return null;
  }
}

//Get user data from the API
export async function getUsers() {
  const url = new URL("users", getBaseUrl());

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
}

//Get order data from the API
export async function getOrders() {
  const url = new URL("orders", getBaseUrl());

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
}

//Port order data to the API
export async function postOrder(order) {
  const url = new URL("orders", getBaseUrl()).toString();

  try {
    const response = await axios.post(url, order);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
}

// Get user's personal orders from the API

//Temp version
export async function getMyOrders(userId) {
  const url = new URL("orders", getBaseUrl());

  try {
    const response = await axios.get(url);
    return response.data.filter(order => order.user.id === userId);
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
}

// TODO: Use version below when backend is ready

// export async function getMyOrders(token) {
//   const url = new URL("orders/me", getBaseUrl());

//   try {
//     const response = await axios.get(url, {
//       headers: {Authorization: `Bearer ${token}`}
//     });
//     return response.data;
//   } catch (error) {
//     console.error("API error:", error);
//     return [];
//   }
// }

//Create product data in the API
export async function addProduct(product) {
  const url = new URL("products", getBaseUrl()).toString();

  try {
    const response = await axios.post(url, product);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
}

//Update product data in the API
export async function updateProduct(product) {
  const url = new URL(`products/${product._id}`, getBaseUrl()).toString();

  try {
    const response = await axios.put(url, product);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
}

//Create variant data in the API
export async function addVariant(variant) {
  const url = new URL("variants", getBaseUrl()).toString();

  try {
    const response = await axios.post(url, variant);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
}

//Update variant data in the API
export async function updateVariant(id, data) {
  const url = new URL(`variants/${id}`, getBaseUrl()).toString();

  try {
    const response = await axios.patch(url, data);
    return response.data;
  } catch (error) {
    console.error("Error updating variant:", error);
    return null;
  }
}

// Register new user
export async function registerUser(name, email, password) {
  const url = new URL("users", getBaseUrl()).toString();

  // check if email already exists
  const checkUrl = new URL("users", getBaseUrl());
  checkUrl.searchParams.append("email", email);

  try {
    const existing = await axios.get(checkUrl.toString());
    if (existing.data.length > 0) {
      throw new Error("Email already exists.");
    }

    const response = await axios.post(url, {
      name,
      email,
      password,
      isAdmin: false,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Login user
export async function loginUser(email, password) {
  const url = new URL("users", getBaseUrl());
  url.searchParams.append("email", email);
  url.searchParams.append("password", password);

  try {
    const response = await axios.get(url.toString());
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

//Update user data in the API
export async function updateUser(user) {
  const url = new URL(`users/${user.id}`, getBaseUrl()).toString(); //TODO: Update to ._id later

  try {
    const response = await axios.put(url, user);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

//add item to wishlist
export async function addWishlist(userId, wishlistedItem) {
  const url = new URL(`users/${userId}`, getBaseUrl()).toString();

  try {
    const response = await axios.patch(url, wishlistedItem);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
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