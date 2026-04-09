import { getProduct, getVariants } from "../utils/api.js";
import { formatDateISO, countdownTimer } from "../utils/utility.js";

//Takes you to the product detail page and adding the product Id as a param
export function goToProduct(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
}

export async function renderProductDetail() {
  //get the id from the params
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  try {
    const product = await getProduct(productId);
    const allVariants = await getVariants();
    const variants = allVariants.filter((v) => v.productId === productId);

    //render all product information
    const image = document.querySelector(".pd-image");
    image.src = product.image;
    image.alt = product.name;

    //Timer
    const timer = document.querySelector(".pd-timer");
    countdownTimer(product.dropDate, timer);

    const releaseDate = document.querySelector(".release-data");
    const date = formatDateISO(product.dropDate);
    releaseDate.textContent = `Release Date: ${date}`;
    const status = document.querySelector(".pd-status");
    status.textContent = product.status;
    const name = document.querySelector(".pd-name");
    name.textContent = product.name;
    const description = document.querySelector(".pd-description");
    description.textContent = product.description;
    const price = document.querySelector(".pd-price");
    price.textContent = `$${product.price}`;
    const sizes = document.querySelector(".pd-sizes");
    console.log(variants);

    variants.forEach((object) => {
      const button = document.createElement("button");
      button.innerText = object.size;
      if (object.stock === 0) {
        button.disabled = true;
      }
      sizes.append(button);
    });
    //run breadcrumb function
    renderBreadcrumbs(product);
  } catch (error) {
    console.error(error);
  }
}

// Only call on product-detail.html
if (window.location.pathname.includes("product-detail.html")) {
  renderProductDetail();

  document.querySelector(".go-back").addEventListener("click", () => {
    window.location.href = "products.html";
  });
}

//for the breadcrumb navigation
function renderBreadcrumbs(product) {
  const container = document.querySelector(".breadcrumb");
  container.innerHTML = "";

  // Home link
  const homeLink = document.createElement("a");
  homeLink.href = "index.html";
  homeLink.textContent = "Home";
  container.append(homeLink);

  // Separator
  container.append(document.createTextNode(" > "));

  // Products link
  const productsLink = document.createElement("a");
  productsLink.href = "products.html";
  productsLink.textContent = "Products";
  container.append(productsLink);

  // Separator
  container.append(document.createTextNode(" > "));

  // Current product name (not a link)
  const current = document.createElement("span");
  current.textContent = product.name;
  container.append(current);
}
