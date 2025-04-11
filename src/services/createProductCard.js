import { productList } from "../../tempTestData/products.js";

function formatCurrency(amount) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 2,
  }).format(amount);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//Counts sum of each product
function countProductSum(product) {
  let sum = product.amount * product.pris;
  return formatCurrency(sum);
}

//Counts sum of whole cart
function totalSum() {
  let totalSum = 0;
  if (sessionStorage.getItem("cart")) {
    let cart = JSON.parse(sessionStorage.getItem("cart"));

    cart.forEach((item) => {
      let num = item.amount * item.pris;
      totalSum += num;
    });
  }
  return formatCurrency(totalSum);
}

function updateTotalSum() {
  let pElement = document.querySelector("#totalSum ");
  let cartSum = document.querySelector(
    "body > header > nav > ul > li:nth-child(3) > a > div > p.price"
  );

  if(pElement){
    pElement.innerText = totalSum();
    cartSum.innerText = totalSum();
  }
}

// Create the product card
function createProductCardElement(product) {
  let productCard = document.createElement("div");
  productCard.classList.add("productCard");

  productCard.innerHTML = `
    <div class="productwrap">
      <img src="${product.bild}" class="productImg">
      <p class="bold L">${capitalizeFirstLetter(product.namn)}</p>
      <p>${product.mangd}</p>
      <p>Varumärke: ${product.varumarke.namn}</p>
      <p>Kategorier: ${product.kategorier
        .map((kategori) => kategori.namn)
        .join(", ")}</p>
      <p class="bold M">${formatCurrency(product.pris)}</p>
    </div>
    <div class="row cartWrap no-margin">
      <button class="cartAdd">
        <img src="assets/logos/basket.svg" alt="Add to Cart">
        Köp
      </button>
    </div>
  `;

  return productCard;
}

// Open product popup
function popUp(product) {
  let popupWindow = createPopupWindow(product);

  let overlay = document.createElement("div");
  overlay.classList.add("overlay");

  popupWindow.querySelector(".closePopup").addEventListener("click", () => {
    popupWindow.remove();
    overlay.remove();
    document.body.style.overflow = "auto";
  });

  document.body.style.overflow = "hidden";
  document.body.append(overlay);
  document.body.append(popupWindow);
}

// Create the popup window
function createPopupWindow(product) {
  let popupWindow = document.createElement("div");
  popupWindow.classList.add("popup");

  popupWindow.innerHTML = `
    <button class="closePopup">X</button>
    <div class="row">
      <img src="${product.bild}" alt="${product.namn}">
      <div class="column">
        <p class="bold L">${capitalizeFirstLetter(product.namn)}</p>
        <p><span>${product.varumarke.namn}</span> | ${product.mangd}</p>
        <p class="bold M">${formatCurrency(product.pris)}</p>
        <div class="cartWrap">
          <button class="cartAdd">
            <img src="assets/logos/basket.svg" alt="Add to Cart">
            <span>Köp</span>
          </button>
        </div>
        <p>Jämförelsepris: ${product.jamforpris}</p>
      </div>
    </div>
    <div class="column productInformation">
      <p class="bold">Produktinformation</p>
      <div class="row">
        <div><p class="produktBeskrivningP">${product.beskrivning}</p></div>
        <div class="column right">
          <div><p class="bold">Leverantör</p><p>${
            product.leverantor.namn
          }</p></div>
        </div>
      </div>
      <div><p class="bold">Innehållsförteckning</p><p>${
        product.innehallsforteckning
      }</p></div>
    </div>
  `;

  popupWindow.querySelector(".cartAdd").addEventListener("click", () => {
    handleAddToCart(product);
  });
  return popupWindow;
}

// Display the cart
function cartView() {
  let cartDiv = document.createElement("div");
  cartDiv.id = "cartDiv";

  cartDiv.innerHTML = `
    <div id="cartProducts"></div>
    <div id="sum">
      <p>SUMMA</p>
      <p id="totalSum">0 kr</p>
    </div>
    <div class="buttonWrap">
      <button id="checkout">Kassan</button>
      <button onclick="window.location.href = 'kassa.html'">Varukorg</button>
    </div>
  `;

  if (document.querySelector("body > header > nav > ul > li:nth-child(3)")) {
    document
      .querySelector("body > header > nav > ul > li:nth-child(3)")
      .append(cartDiv);
  }
}

// Function to show cart on hover
cartView();

if (document.querySelector("a.cart")) {
  document.querySelector("a.cart").addEventListener("mouseenter", () => {
    document.querySelector("#cartDiv").style.display = "flex";
  });
}

document
  .querySelector("main.main-content")
  .addEventListener("mouseenter", () => {
    document.querySelector("#cartDiv").style.display = "none";
  });

// Create the quantity control
// function createQuantityControl() {
//   let plusMinusContainer = document.createElement("div");
//   plusMinusContainer.classList.add("plusMinusContainer");

//   plusMinusContainer.innerHTML = `
//     <button class="minus">-</button>
//     <input type="number" class="quantityInput" value="1" min="1">
//     <button class="plus">+</button>
//   `;

//   plusMinusContainer.querySelector(".minus").addEventListener("click", () => {
//     let quantityInput = plusMinusContainer.querySelector(".quantityInput");
//     if (parseInt(quantityInput.value) > 1) {
//       quantityInput.value = parseInt(quantityInput.value) - 1;
//     }
//   });

//   plusMinusContainer.querySelector(".plus").addEventListener("click", () => {
//     let quantityInput = plusMinusContainer.querySelector(".quantityInput");
//     quantityInput.value = parseInt(quantityInput.value) + 1;
//   });

//   return plusMinusContainer;
// }

// Set up product cards and event listeners
export function createProductCard(products) {
  let productContainer = document.querySelector("#productContainer");

  products.forEach((product) => {
    let productCard = createProductCardElement(product);
    let cartAddButton = productCard.querySelector(".cartAdd");

    cartAddButton.addEventListener("click", () =>
      handleAddToCart(product, cartAddButton, productCard)
    );
    productCard
      .querySelector(".productwrap")
      .addEventListener("click", () => popUp(product));

    productContainer.append(productCard);
  });
}

// Handle add to cart button
function handleAddToCart(product) {
  //cartAddButton.style.display = "none";

  let currentCart = JSON.parse(sessionStorage.getItem("cart")) || [];

  if (currentCart.length === 0) {
    product.amount = 1;
    currentCart.push(product);
    sessionStorage.setItem("cart", JSON.stringify(currentCart));
  } else {
    let productExists = currentCart.some((item) => item.namn === product.namn);
    if (productExists) {
      currentCart = currentCart.map((item) => {
        if (item.namn === product.namn) {
          item.amount = item.amount + 1;
        }
        return item;
      });
    } else {
      product.amount = 1;
      currentCart.push(product);
    }
    sessionStorage.setItem("cart", JSON.stringify(currentCart));
  }
  reloadCart();
}

// Create product view for thecart and add it to the cart.
function cartProduct(product, amount, price) {
  let div = document.createElement("div");
  div.classList.add("marginTB");
  div.innerHTML = `
    <img src="${product.bild}" width="80px">
    <div>
      <p class="bold L">${capitalizeFirstLetter(product.namn)}</p>
      <p class="bold M">${formatCurrency(product.pris)}</p>
      <p>Antal: ${amount}</p>
      <p>Summa: <span class="bold">${price}</span></p>
    </div>
  `;
  return div;
}

async function fetchProductsFromDB() {
  try {
    let response = await fetch("https://grupp-11-backend.vercel.app/api/products");
    let allProducts = await response.json();
    return allProducts;

  } catch (error) {
    console.error("Error fetching products:");
  }
}


// After reloding page relode the cart
export async function reloadCart() {
  if(document.querySelector("#cartProducts")){
    document.querySelector("#cartProducts").innerHTML = "";
  }
  
  let validCart = uppdateSessionStorage();

  if (validCart.length>0) {
    validCart.forEach((product) => {
      let price = countProductSum(product);
      let newProduct = cartProduct(product, product.amount, price);
      if (document.querySelector("#cartProducts")) {
        document.querySelector("#cartProducts").append(newProduct);
      }
    });
  }
  updateTotalSum();
}

function uppdateSessionStorage() {
  let productsDB = await fetchProductsFromDB();
  let storedCart = JSON.parse(sessionStorage.getItem("cart"));

  let updatedCart = storedCart.map(cartItem => {
      return productsDB.find(product => product.id === cartItem.id);
  }).filter(item => item !== undefined);

  return updatedCart;
}


//Wen the page loads relodes the cart
reloadCart();
