import { fetchProducts } from "../utils/api.js";
import { createProductCard } from "./createProductCard.js";
import { products } from "../scripts/index.js";

export const sortProducts = async(chosenCategory) => {

    const productsContainer = document.getElementById("productContainer");

    try {

    productsContainer.innerHTML = ""; 

    if (products.length > 0) {
        const sortedProducts = []

        products.forEach((product) => {
            product.kategorier.forEach(category => {
                category.namn === chosenCategory && sortedProducts.push(product);
            })
        });

        createProductCard(sortedProducts);


    } else {
        productsContainer.innerHTML = "<p>No products available.</p>";
    }
    } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = "<p>Failed to load products.</p>";
    }
}