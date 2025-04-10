import { fetchProducts, fetchCategories } from "../utils/api.js";

//document.addEventListener("DOMContentLoaded", loadCategories);

let selectedCategory = "Alla kategorier";

let shoppingCart = JSON.parse(localStorage.getItem("Products"));
if (shoppingCart !== null) {
  let cartMobilemenu = document.getElementById("cart-mobilemenu");
  cartMobilemenu.innerHTML = `Varukorg ( ${shoppingCart.length} )`;
  let cartHeader = document.getElementById("cart-header");
  cartHeader.innerHTML = `Varukorg ( ${shoppingCart.length} )`;
}

loadCategories();

document.querySelectorAll("#categorylist").forEach((btn) => {
  //console.log(btn);
  btn.addEventListener("click", (e) => {
    selectedCategory = e.target.id;
    //selectedCategory = e.target.innerHTML;
    console.log(selectedCategory);
    //selectedCategory = "alla";
    filterProductsByCategory(selectedCategory);
  });
});

filterProductsByCategory(selectedCategory);

// Function to fetch and render products
async function loadCategories() {
  const categoriesContainer = document.querySelector("#categorylist");
  categoriesContainer.innerHTML = "<p>Loading category...</p>"; // Temporary message while loading

  try {
    const categories = await fetchCategories();
    console.log(categories);
    categoriesContainer.innerHTML = ""; // Clear loading text
    if (categories.length > 0) {
      const element = document.createElement("div");
      element.className = "Alla kategorier";
      element.innerHTML = `<button id="Alla kategorier">Alla kategorier</button>`;
      categoriesContainer.appendChild(element);
      categories.forEach((category) => {
        //const categoriesList = createCategoriesList(category);
        const element = document.createElement("div");
        element.className = category.name;
        element.innerHTML = `<button id="${category.name}">${category.name}</button>`;
        categoriesContainer.appendChild(element);
      });
    } else {
      categoriesContainer.innerHTML = "<p>No categories available.</p>";
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    categoriesContainer.innerHTML = "<p>Failed to load categories.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);

async function filterProductsByCategory(category) {
  const products = await fetchProducts();
  //console.log(products);
  //console.log(category);
  if (category === "Alla kategorier" || category === "") {
    let filterdProducts = products.filter((prod) => prod.category);
    loadProducts(filterdProducts);
    console.log(filterdProducts);
    //return filterdProducts;
  } else {
    let filterdProducts = products.filter((prod) => prod.category == category);
    loadProducts(filterdProducts);
    console.log(filterdProducts);
    //return filterdProducts;
  }
}

async function filterProductsBySearch(searchInput) {
  const products = await fetchProducts();
  //let category = "Alla kategorier";
  //console.log(products);
  if (searchInput === "") {
    let filterdProducts = products.filter((prod) => prod.title);

    loadProducts(filterdProducts);
    console.log(filterdProducts);
    //return filterdProducts;
  } else {
    let filteredProducts = products.filter((prod) =>
      prod.title.toLowerCase().includes(searchInput.toLowerCase())
    );
    
  
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    
    loadProducts(filteredProducts);
    console.log(filteredProducts);
    
    //return filterdProducts;
  }

  //return filterdProducts;
}

// Function to fetch and render products
async function loadProducts(filterdProducts) {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "<p>Loading products...</p>"; // Temporary message while loading

  try {
    //const products = await fetchProducts();
    //const products = await filterProducts(category);
    let products = filterdProducts;
    productsContainer.innerHTML = ""; // Clear loading text
    if (products.length > 0) {
      products.forEach((product) => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
      });
    } else {
      productsContainer.innerHTML = "<p>No products available.</p>";
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = "<p>Failed to load products.</p>";
  }
}

// Function to create an individual product card
function createProductCard(product) {
  const element = document.createElement("div");
  let cartValue = 0;
  element.className = "product-card";

  let shoppingCart = JSON.parse(localStorage.getItem("Products"));

  if (shoppingCart !== null) {
    for (let i = 0; i < shoppingCart.length; i++) {
      if (shoppingCart[i].title === product.title) {
        cartValue++;
      }
    }
  }

  if (shoppingCart !== null && cartValue > 0) {
    element.innerHTML = `
    <div class="product-card-background"></div>
    <div class="product-card-info">
    <img src="${product.image}" alt="${product.title}"
      onerror="this.onerror=null; this.src='./src/images/products/placeholder.jpg';" class="product-card-img" />
    <h3>${product.title}</h3>
    <div class="product-card-extra-info">
      <P>${product.description}</p>
      <P>${product.weight}</p>
      <P>${product.producer}</p>
      <P>${product.category}</p>
    </div>
    <p>${product.price.toFixed(2)} kr</p>
    <div class="cart-button-array">
      <div id="cartbuttonminus" class="cart-button-minus">-</div>
      <div id="cartbuttoncount" class="cart-button-count">Varukorg (${cartValue})</div>
      <div id="cartbuttonplus" class="cart-button-plus">+</div>
    </div>
    <div id="cardbutton" class="card-button"><button class="add-to-cart-btn">Köp</button></div>
    </div>
  `;
    element.querySelector(".cart-button-array").style.display = "flex";
    element.querySelector("#cardbutton").style.display = "none";
    element.querySelector(".product-card-extra-info").style.display = "none";
  } else {
    element.innerHTML = `
    <div class="product-card-background"></div>
    <div class="product-card-info">
    <img src="${product.image}" alt="${product.title}"
      onerror="this.onerror=null; this.src='./src/images/products/placeholder.jpg';" class="product-card-img" />
    <h3>${product.title}</h3>
    <div class="product-card-extra-info">
      <P>${product.description}</p>
      <P>${product.weight}</p>
      <P>${product.producer}</p>
      <P>${product.category}</p>
    </div>
    <p>${product.price.toFixed(2)} kr</p>
    <div class="cart-button-array">
      <div id="cartbuttonminus" class="cart-button-minus">-</div>
      <div id="cartbuttoncount" class="cart-button-count">Varukorg (0)</div>
      <div id="cartbuttonplus" class="cart-button-plus">+</div>
    </div>
    <div id="cardbutton" class="card-button"><button class="add-to-cart-btn">Köp</button></div>
    </div>
  `;
    element.querySelector(".product-card-extra-info").style.display = "none";
  }

  element.querySelector(".product-card-img").addEventListener("click", () => {
    //element.querySelector(".product-card-extra-info").style.display = "block";

    const mainProductCardContainer = document.querySelector(
      "#productCardBackground"
    );

    const mainProductCardItem = document.createElement("div");
    mainProductCardItem.className = "main-product-card-item";
    mainProductCardItem.innerHTML = `
      <div class="product-card-info">
        <img src="${product.image}" alt="${product.title}"
          onerror="this.onerror=null; this.src='./src/images/products/placeholder.jpg';" class="product-card-img" />
        <h3>${product.title}</h3>
        <div class="product-card-extra-info-view">
          <P>${product.description}</p>
          <P>${product.weight}</p>
          <P>${product.producer}</p>
          <P>${product.category}</p>
        </div>
        <p>${product.price.toFixed(2)} kr</p>
      </div>
    `;
    document.querySelector(".main-product-card-content").style.display =
      "block";
    mainProductCardContainer.appendChild(mainProductCardItem);
  });

  element.querySelector(".cart-button-plus").addEventListener("click", () => {
    cartValue++;
    let shoppingCart = JSON.parse(localStorage.getItem("Products"));
    shoppingCart.push(product);
    localStorage.setItem("Products", JSON.stringify(shoppingCart));
    shoppingCart = JSON.parse(localStorage.getItem("Products"));
    let cartCardView = element.querySelector("#cartbuttoncount");
    cartCardView.innerHTML = `Varukorg (${cartValue})`;
    let cartHeader = document.getElementById("cart-header");
    cartHeader.innerHTML = `Varukorg ( ${shoppingCart.length} )`;
    let cartMobilemenu = document.getElementById("cart-mobilemenu");
    cartMobilemenu.innerHTML = `Varukorg ( ${shoppingCart.length} )`;
  });

  element.querySelector(".cart-button-minus").addEventListener("click", () => {
    cartValue--;
    let shoppingCart = JSON.parse(localStorage.getItem("Products"));

    let index = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
      if (shoppingCart[i].title === product.title) {
        index = i;
      }
    }
    shoppingCart.splice(index, 1);
    localStorage.setItem("Products", JSON.stringify(shoppingCart));
    shoppingCart = JSON.parse(localStorage.getItem("Products"));
    let cartCardView = element.querySelector("#cartbuttoncount");
    cartCardView.innerHTML = `Varukorg (${cartValue})`;
    let cartHeader = document.getElementById("cart-header");
    cartHeader.innerHTML = `Varukorg ( ${shoppingCart.length} )`;
    let cartMobilemenu = document.getElementById("cart-mobilemenu");
    cartMobilemenu.innerHTML = `Varukorg ( ${shoppingCart.length} )`;

    if (cartValue === 0) {
      element.querySelector(".cart-button-array").style.display = "none";
      element.querySelector("#cardbutton").style.display = "block";
    }

    if (shoppingCart.length === 0) {
      localStorage.removeItem("Products");
    }
  });

  element.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    element.querySelector(".cart-button-array").style.display = "flex";
    element.querySelector("#cardbutton").style.display = "none";
    let shoppingCart = JSON.parse(localStorage.getItem("Products"));
    if (shoppingCart !== null) {
      console.log(shoppingCart);
      shoppingCart.push(product);
      localStorage.setItem("Products", JSON.stringify(shoppingCart));
    } else {
      let products = [];
      products.push(product);
      shoppingCart = localStorage.setItem("Products", JSON.stringify(products));
    }

    shoppingCart = JSON.parse(localStorage.getItem("Products"));
    console.log(shoppingCart.length);
    let cartHeader = document.getElementById("cart-header");
    cartHeader.innerHTML = `Varukorg ( ${shoppingCart.length} )`;
    let cartMobilemenu = document.getElementById("cart-mobilemenu");
    cartMobilemenu.innerHTML = `Varukorg ( ${shoppingCart.length} )`;
    cartValue++;
    let cartCardView = element.querySelector("#cartbuttoncount");
    cartCardView.innerHTML = `Varukorg (${cartValue})`;
  });

  return element;
}

// Function to toggle sidemenu on mobile view
const togglesidebar = document.getElementById("togglesidebar");
togglesidebar.addEventListener("click", mySidebarToggle);

function mySidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("show");
}

document.querySelector("#cart-header").addEventListener("click", () => {
  document.querySelector(".cart-content").style.display = "block";
  let shoppingCart = JSON.parse(localStorage.getItem("Products"));
  const cartContainer = document.querySelector(".cart-list");

  cartContainer.innerHTML = "";
  const element = document.createElement("h1");
  element.innerHTML = `Varukorg`;
  cartContainer.appendChild(element);

  if (!shoppingCart) {
    const cartContainer2 = document.querySelector(".cart-list");
    const element2 = document.createElement("div");
    element2.innerHTML = `Varukorgen är tom`;
    cartContainer2.appendChild(element2);
  } else {
    shoppingCart.forEach((product) => {
      const element = document.createElement("div");
      element.className = product.title;
      element.innerHTML = `<div>${product.title}</div>`;
      cartContainer.appendChild(element);
    });
  }

  if (shoppingCart) {
    const elementOrder = document.createElement("div");
    elementOrder.innerHTML = `<a href="/order.html">Lägg till order</a>`;
    cartContainer.appendChild(elementOrder);
  }
});

document.querySelector("#cart-mobilemenu").addEventListener("click", () => {
  document.querySelector(".cart-content").style.display = "block";
  let shoppingCart = JSON.parse(localStorage.getItem("Products"));
  const cartContainer = document.querySelector(".cart-list");

  cartContainer.innerHTML = "";
  const element = document.createElement("h1");
  element.innerHTML = `Varukorg`;
  cartContainer.appendChild(element);

  if (!shoppingCart) {
    const cartContainer2 = document.querySelector(".cart-list");
    const element2 = document.createElement("div");
    element2.innerHTML = `Varukorgen är tom`;
    cartContainer2.appendChild(element2);
  } else {
    shoppingCart.forEach((product) => {
      const element = document.createElement("div");
      element.className = product.title;
      element.innerHTML = `<div>${product.title}</div>`;
      cartContainer.appendChild(element);
    });
  }

  if (shoppingCart) {
    const elementOrder = document.createElement("div");
    elementOrder.innerHTML = `<a href="/order.html">Lägg till order</a>`;
    cartContainer.appendChild(elementOrder);
  }
});

document.querySelector(".cart-background").addEventListener("click", () => {
  document.querySelector(".cart-content").style.display = "none";
});

document
  .querySelector(".product-card-background")
  .addEventListener("click", () => {
    const mainProductCardContainer = document.querySelector(
      ".main-product-card-item"
    );
    mainProductCardContainer.remove();
    document.querySelector(".main-product-card-content").style.display = "none";
  });

let input = document.getElementById("site-header-search");
// input.addEventListener("keypress", (e) => {
//   let input = document.getElementById("site-header-search").value;
//   filterProductsBySearch(input);
//   if (e.key === "Enter") {
//     e.preventDefault();
//   }
// });

input.addEventListener("input", () => {
  const inputValue = document.getElementById("site-header-search").value;
  filterProductsBySearch(inputValue);
});
