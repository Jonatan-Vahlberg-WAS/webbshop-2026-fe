import { getProducts, getVariants } from "../utils/api.js";
import { getCurrentUser } from "../utils/auth.js";

async function renderCart() {
  let subtotal = 0;

  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const products = await getProducts();
    const variants = await getVariants();
    const cartContainer = document.querySelector(".cart-container");

    if (cart) {
      cart.forEach((item) => {
        //Match the products in the cart with the database
        const product = products.find((p) => p._id === item.productId);

        const variant = variants.find(
          (v) => v.productId === item.productId && v.size === item.size,
        );

        if (!product || !variant) return;

        const imgDiv = document.createElement("div");
        imgDiv.classList.add("product-img");
        const img = document.createElement("img");
        const namePriceContainer = document.createElement("div");
        namePriceContainer.classList.add("product-row");
        const name = document.createElement("span");
        name.classList.add("product-name");
        const price = document.createElement("span");
        price.classList.add("product-price");
        const size = document.createElement("p");
        size.classList.add("product-size");

        img.src = product.image;
        name.textContent = product.name;
        price.textContent = `$${product.price}`;
        size.textContent = `Size: ${variant.size} US`;

        imgDiv.append(img);
        namePriceContainer.append(name, price);

        cartContainer.append(imgDiv, namePriceContainer, size);

        subtotal += product.price;
      });
    } else {
      cartContainer.textContent = "Cart is empty";
      cartContainer.classList.add("empty-cart");
    }

    // Extract 25% VAT from total (included in price)
    const taxes = subtotal * 0.25;

    const subtotalEl = document.querySelector(".subtotal");
    const taxesEl = document.querySelector(".taxes");

    subtotalEl.textContent = `$ ${subtotal.toFixed(2)}`;
    taxesEl.textContent = `$ ${taxes.toFixed(2)}`;

    const totalWithTax = subtotal + taxes;
    const totalPrice = document.querySelector(".total-price");
    totalPrice.textContent = `Total: $${totalWithTax.toFixed(2)}`;
  } catch (err) {
    console.error(err);
  }
}

// Only call on cart.html
if (window.location.pathname.includes("cart.html")) {
  renderCart();
}
