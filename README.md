webbadress: https://webshop-2025-g11-fe1.vercel.app/
Api: https://grupp-11-backend.vercel.app/api/

Här är login för Admin:
Username:Hakimadmin
Lösenord:Hakim123admin

"endpoints": {
"auth": {
"POST /api/auth/register": "Register a new user",
"POST /api/auth/login": "Login with username and password"
},
"products": {
"GET /api/products": "Get all products",
"GET /api/products/:id": "Get a single product by ID",
"POST /api/products": "Create a new product (Admin only)",
"PUT /api/products/:id": "Update a product (Admin only)",
"DELETE /api/products/:id": "Delete a product (Admin only)"
},
"categories": {
"GET /api/categories": "Get all categories"
},
"brands": {
"GET /api/brands": "Get all brands"
},
"suppliers": {
"GET /api/suppliers": "Get all suppliers"
}
},
"authentication": "Use Bearer token in Authorization header for protected routes"

testing
