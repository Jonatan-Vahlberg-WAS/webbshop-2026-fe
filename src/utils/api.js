function getToken() {
  return sessionStorage.getItem('token');
}

export function getBaseUrl() {
if (!window.location.href.includes('localhost')) {
  return "https://grupp-3.vercel.app/" 
}
return "http://localhost:3000/"; 
}

export async function fetchProducts(endpoint = "api/products") {
const url = `${getBaseUrl()}${endpoint}`;
console.log(`Workspaceing products from: ${url}`);
try {

  const response = await fetch(url); 
  if(response.ok){ const data = await response.json(); return data; } 
  else { console.error(`Error fetching products: ${response.status} ${response.statusText}`); return []; }
} catch (error) { console.error('Network error fetching products:', error); return []; }
}

export async function fetchCategories(endpoint = "api/categories") {
const url = `${getBaseUrl()}${endpoint}`;
console.log(`Workspaceing categories from: ${url}`);
try {
  
  const response = await fetch(url); 
  if(response.ok){ const data = await response.json(); return data; }
  else { console.error(`Error fetching categories: ${response.status} ${response.statusText}`); return []; }
} catch (error) { console.error('Network error fetching categories:', error); return []; }
}

export async function fetchUsers(endpoint = "api/users") {

const url = `${getBaseUrl()}${endpoint}`;
console.log(`Workspaceing users from: ${url}`); 
const token = getToken();
const headers = {};
if (token) { headers['Authorization'] = `Bearer ${token}`; } 
else { console.warn("No token found for fetching users.");  }

try {
  const response = await fetch(url, { headers }); 
  if(response.ok){ const data = await response.json(); return data; }
  else { console.error(`Error fetching users: ${response.status} ${response.statusText}`); return []; }
} catch (error) { console.error('Network error fetching users:', error); return []; }
}

export async function fetchOrders(endpoint = "api/orders") {

const url = `${getBaseUrl()}${endpoint}`;
console.log(`Workspaceing orders from: ${url}`); 
const token = getToken();
const headers = {};
if (token) { headers['Authorization'] = `Bearer ${token}`; } 
else { console.warn("No token found for fetching orders."); }

try {
  const response = await fetch(url, { headers }); 
  if(response.ok){ const data = await response.json(); return data; }
  else { console.error(`Error fetching orders: ${response.status} ${response.statusText}`); return []; }
} catch (error) { console.error('Network error fetching orders:', error); return []; }
}


export async function addProduct(productData) {
const url = `${getBaseUrl()}api/products`; 
console.log(`Attempting to POST product to: ${url}`);
const token = getToken();

try {
  const response = await fetch(url, { 
      method: 'POST', 
      headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }) 
      }, 
      body: JSON.stringify(productData) 
  });
  
  if (response.ok) { const result = await response.json(); console.log("Product added via API:", result); return { success: true, data: result }; } 
  else { const errorData = await response.json().catch(() => ({ message: response.statusText })); console.error(`API Error adding product (${response.status}):`, errorData); return { success: false, status: response.status, error: errorData }; }
} catch (error) { console.error('Network error adding product:', error); return { success: false, error: { message: error.message } }; }
}

export async function deleteProduct(productId) {
const url = `${getBaseUrl()}api/products/${productId}`; 
console.log(`Attempting to DELETE product from: ${url}`);
if (!productId) { /*...*/ return { success: false, error: { message: "Product ID saknas" } }; }
const token = getToken(); 

try {
  const response = await fetch(url, { 
      method: 'DELETE', 
      headers: { 
          
           ...(token && { 'Authorization': `Bearer ${token}` }) 
      } 
  });
  if (response.ok) { console.log("Product deleted via API (Status:", response.status, ")"); if (response.status === 204) { return { success: true, data: null }; } else { const result = await response.json().catch(() => null); return { success: true, data: result }; } } 
  else { const errorData = await response.json().catch(() => ({ message: response.statusText })); console.error(`API Error deleting product (${response.status}):`, errorData); return { success: false, status: response.status, error: errorData }; }
} catch (error) { console.error('Network error deleting product:', error); return { success: false, error: { message: error.message } }; }
}

export async function fetchProductById(productId) {

const url = `${getBaseUrl()}api/products/${productId}`;
console.log(`Workspaceing product by ID from: ${url}`);
if (!productId) { return null; }
try {
    
    const response = await fetch(url); 
    if (response.ok) { return await response.json(); } 
    else { console.error(`Error fetching product ${productId}: ${response.status}`); return null; }
} catch (error) { console.error(`Network error fetching product ${productId}:`, error); return null; }
}

export async function updateProduct(productId, productData) {
const url = `${getBaseUrl()}api/products/${productId}`; 
console.log(`Attempting to PUT product update to: ${url}`);
if (!productId) { return { success: false, error: { message: "Product ID saknas" } }; }
const token = getToken(); 

try {
  const response = await fetch(url, {
    method: 'PUT', 
    headers: {
      'Content-Type': 'application/json',
       ...(token && { 'Authorization': `Bearer ${token}` }) 
    },
    body: JSON.stringify(productData) 
  });

  if (response.ok) { const result = await response.json(); console.log("Product updated via API:", result); return { success: true, data: result }; } 
  else { const errorData = await response.json().catch(() => ({ message: response.statusText })); console.error(`API Error updating product (${response.status}):`, errorData); return { success: false, status: response.status, error: errorData }; }
} catch (error) { console.error('Network error updating product:', error); return { success: false, error: { message: error.message } }; }
}