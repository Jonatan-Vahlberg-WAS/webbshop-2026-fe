import dummyProducts from "../data/dummy_products_sv.json" assert { type: "json" };

document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  dummyProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    productCard.innerHTML = `
      <img src="./src/images/products/${product._id}.jpg" alt="${product.name}" onerror="this.src='./src/images/products/placeholder.jpg'" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>${product.price.toFixed(2)} kr</strong></p>
      <button class="add-to-cart-btn">Lägg i kundvagn</button>
    `;

    productsContainer.appendChild(productCard);
  });
});