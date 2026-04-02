//Get base API Url
// export function getBaseUrl() {
//   if (window.location.hostname.includes("localhost") && false) {
//     return "http://localhost:3000/";
//   }
//   return "https://webbshop-2026-be.vercel.app//";
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

//Get variant data from the API
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
