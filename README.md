## ADRESSER

webbadress: https://webshop-2025-g11-fe1.vercel.app/
Api: https://grupp-11-backend.vercel.app/api/
Github repo: https://github.com/VictorErikson/Hakim-Livs/

## LOGIN

Här är login för Admin:
Username:Hakimadmin
Lösenord:Hakim123admin

## ENDPOINTS

Endpoints:
{
"name": "Hakim Livs API",
"version": "1.0.0",
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
},
"orders": {
"GET /api/orders": "Get all orders (Admin only)",
"POST /api/orders": "Create a new order"
}
},
"authentication": "Use Bearer token in Authorization header for protected routes"
}

## DEPLOYMENT

Deployment: Merga till main för att uppdatera sidan.

## SÅHÄR FUNGERAR SITEN

Användning av siten:
användare kan sortera och lägga till produkter i varukorg för att sen skicka en order på kassa, Admin kan hantera/radera produkter samt ordrar på admin-sidan.

## VARIABLER

Variabler finns i \_variables.scss-filen.

## KÖRA SIDAN LOKALT

Starta projektet lokalt med open live-server extention på den page du vill se. OBS att fetcha/hanter produkter och logga in funkar BARA på den deployade sidan (https://webshop-2025-g11-fe1.vercel.app/)
Om man vill testa med "lokala-produkter" ändra rad 19 och 20 i index.js från:
products = await fetchProducts();
// products = productList;
till
// products = await fetchProducts();
products = productList;
MEN kom ihåg att ändra tillbaka innan merge till Main.

## MAPPSTRUKTUR

HTML-filer (utom index) i /HTML
scss-filer i /partials
scriptfiler för specifika pages i /src/script
scriptfiler för services i /src/services

## FONTS & LOGOS

fonts och logos i /assets
font Compacta importeras i index.scss och kan sen användas på valfri plats

## IMPORTERA

AXIOS måste vara med i header på de html-pages där man vill använda axios ( <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>)
Annars behövs bara node.js och Live Sass Compiler-extention.
Hjälp-funktioner finns i /src/services, samt den mest användbar fetch-funktionen som är api.js i /src/utils/api.js.

## FÖRBÄTTRINGSMÖJLIGHETER

Det finns mycket att förbättra, men den största buggen är att varukorgen inte uppdateras till tom om man beställer sin order från varukorgs-sidan.
