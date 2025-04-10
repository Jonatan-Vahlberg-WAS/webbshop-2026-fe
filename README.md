# Hakim Livs
Hakim Livs är en digitalisering av matbutiken med samma namn med huvudsyftet att tillgängliggöra e-handel från Hakim Livs till dess kunder. Projektet består av frontend, backend och har under projektet testats av kvalitetstestare.
Projektet innehåller följande viktiga funktioner:
- Inloggning och registrering
- Användare
    - User (Besökare och kunder)
    - Admin (Användare med admin-åtkomst för hantering av sidans innehåll)
- Produktvy
- Kategorivy
- Varukorg och kassa med funktionalitet
- Sökfunktion för produkter och kategorier
- Admin-panel
    - Hantering av produkter (Visa, skapa, redigera och ta bort)
    - Hantering av kategorier (Visa)
    - Hantering av kunder (Visa)
    - Hantering av ordrar (Visa)
    - Låst åtkomst för icke-behöriga användare

##  Mappstruktur och arkitektur
Projektet är uppdelat i följande huvudmappar:

```
/src
    /data
    /images
        /products
    /scripts
    /utils
/public
/css
index.html
admin.html
login.html
order.html
main.css
order.css
style.css
header.css
footer.css
global.css
admin.css
```
## Setup och installation
För att köra projektet lokalt:

1. Klona repot: [https://github.com/johnnykly/2405_G03_FE/] alternativt ladda ner .zip-filen och öppna i kodhanterare.
2. Öppna repot i kodhanterare
3. Installera och öppna med t.ex. Live Server för att skapa en lokal server


För att deploya projektet:
1. Klona repot: [https://github.com/johnnykly/2405_G03_FE/] alternativt ladda ner .zip-filen och öppna i kodhanterare.
2. Pusha repot till GitHub
3. Skapa ett konto på t.ex. Vercel
4. Koppla ihop repots aktuella branch med ett Vercel-projekt (Rekommenderat att aktivera automatic deploy för automatiska uppdateringar)
5. Publicera Vercel-projekt
```
Användning och hantering av backend-kod hänvisas till backends readme.md
```


## Kodbibliotek
|Teknologi       |Användning       |
|  ---  |  ---  |
|HTML5       |Struktur och layout på webbsidan.       |
|CSS       |Design för webbsidan.       |
|JavaScript       |Funktionalitet på webbsidan.       |
|Font Awesome       |Ikongrafik på webbsidan.       |
|Figma       |Design för UI/UX prototyper       |

## Endpoints (API)
|Metod       |Endpoint       |Beskrivning       |
|  ---  |  ---  |  ---  |
|POST       |auth/register       |Registrera ny användare       |
|POST       |auth/login       |Logga in med användare och lösenord       |
|GET       |/products       |Hämta produkter       |
|GET       |/products/:id       |Hämta produkt per ID       |
|POST       |/products       |Skapa ny produkt       |
|PUT       |/products/:id       |Uppdatera en produkt       |
|DELETE       |/products/:id       |Radera en produkt       |
|GET       |/categories       |Hämta alla kategorier       |
|GET       |/orders       |Hämta alla ordrar       |
|GET       |/orders/:id       |Hämta en specifik order per ID       |
|GET       |/orders/user/myorders       |Hämta nuvarande användares ordrar       |
|POST       |/orders       |Skapa en ny order       |
|PUT       |/orders/:id/status       |Uppdatera orderstatus       |
|PUT       |/orders/:id/cancel       |Avbryt order       |

```
Ansluten till backend-API via [https://grupp-3.vercel.app/api/]
```
## Miljöer
### Deployment
Miljö Beskrivning Fork source GitHub URL

|Miljö       |Beskrivning       |Fork source       |Källa       |URL       |
|  ---  |  ---  |  ---  |  ---  |  ---  |
|Production       |Frontend       |https://github.com/Jonatan-Vahlberg-WAS/BE-Webshop-2025-FE       |GitHub       |https://github.com/johnnykly/2405_G03_FE/       |
|Production       |Backend       |https://github.com/Nackademin-BE-1-Admin/Webshop-2025-BE-G1       |GitHub       |https://github.com/SandraLinnea/Grupp-3       |
|Deployed       |Frontend Live       |       |Vercel       |https://2405-g03-fe.vercel.app/       |
|Deployed       |Backend Live       |       |Vercel       |https://webshop-2025-be-g1.vercel.app/       |
|Development       |Frontend       |       |Localhost       |http://localhost:5500       |
|Development       |Backend       |       |Localhost       |http://localhost:3000       |
|Design       |UX/UI Mockups      |       |Figma       |https://www.figma.com/design/NHNyjULjqwIqo7E0so7iwT/2405%3A-Hakim-Livs?node-id=0-1&t=rvliz4jTLEXBngk6-1       |
|Design       |UX/UI Prototype       |       |Figma       |https://www.figma.com/proto/NHNyjULjqwIqo7E0so7iwT/2405%3A-Hakim-Livs?node-id=0-1&t=rvliz4jTLEXBngk6-1       |



## Enkel vägledning för användning av siten

|Fil       |Beskrivning       |
|  ---  |  ---  |
|index.html       |Startsida för webbshop       |
|login.html       |Inloggningsida för användare och admin       |
|order.html       |Varukorgshantering och kassa för kund       |
|admin.html       |Admin-panel för att hantera produkter, kategorier, kunder och ordrar       |


## Hjälp-funktioner (t.ex för API-anrop) - Vilka funktioner kan/bör återanvändas genomgående i projektet, och vart hittar man dem?

### Funktioner 

| Fil                         | Syfte                                                                 | Funktioner                                                                 |
|----------------------------|--------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| `src/utils/api.js`         | Huvudfil för API-anrop med JWT-autentisering och dynamisk URL-hantering       | `getToken()`, `getBaseUrl()`, `fetchProducts()`, `fetchCategories()`, `fetchUsers()`, `fetchOrders()`, `addProduct()`, `deleteProduct()`, `fetchProductById()`, `updateProduct()` |
| `src/scripts/detailModal.js`| Visar produktmodal med detaljer från `dummyProducts`                          | `showProductDetailModal(productTitle)` – bygger och visar DOM-baserad modal               |
| `src/scripts/index.js`     | Dynamisk rendering av produkter och kategorier på startsidan                  | `loadCategories()`, `filterProductsByCategory()`, `filterProductsBySearch()`, `loadProducts()`, `createProductCard()` |
| `src/scripts/order.js`     | Hanterar varukorg, formulär och beställningar på ordersidan                   | FormData-hantering, `orderItems`, `totalPrice`, autofyll, och POST-anrop till API         |
| `src/scripts/login.js`     | Inloggning och registrering med vyhantering                                  | `submit` events för login/register, JWT-hantering, vyväxling mellan login och registrering |
| `src/scripts/admin.js`     | Adminpanelens logik och dynamisk DOM-hantering för CRUD på data               | `showSection()`, `resetEditMode()`, `loadCategories()`, `loadProductList()`, `loadCustomerList()`, `loadOrderList()`, `loadCategoryList()`, `handleEditProduct()`, `handleDeleteProduct()` |


## Förbättringspunkter

### Functionality
- User token har mer användardata som kan användas för t.ex. autofyllning vid order
- Förbättring av presentation av varukorg med t.ex. antal, pris och summa.
- Refaktorering av vissa funktioner för att minska komplexiteten.
- Implementering av mer omfattande tester för API-rutter och funktionalitet.
- Implementering av API-funktioner i adminpanelen såsom hantering av kunder, ordrar och kategorier

### Performance
- Optimering av databasfrågor för bättre prestanda.
- Optimering av bilder t.ex. komprimering för webbstandard.

### Styling
- Förbättrat användargränssnitt av
    - Startsida
    - Produktsida
    - Inloggningssida
    - Sidomeny
    - Header
    - Footer
- Förbättring av tillgänglighet som t.ex. färger och bättre mobilanpassning