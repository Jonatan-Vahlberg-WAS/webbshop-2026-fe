
// import { products } from "../scripts/index.js";

export const searchProduct = async(searchWord, printFunction, products) => {
    const productsContainer = document.getElementById("productContainer");

    productsContainer.innerHTML = ""; 
    if (products.length > 0) {
        const sortedProducts = []

        products.forEach((product) => {
           
            const match =
            (product.kategorier?.some(cat => cat?.namn.toLowerCase().includes(searchWord.toLowerCase())) ||
            product.namn?.toLowerCase().includes(searchWord.toLowerCase()) ||
            product.beskrivning?.toLowerCase().includes(searchWord.toLowerCase()) ||
            product.varumarke?.namn.toLowerCase().includes(searchWord.toLowerCase()) ||
            product.leverantor?.namn.toLowerCase().includes(searchWord.toLowerCase()));
    
        if (match) sortedProducts.push(product);
        });

        printFunction(sortedProducts);


    } else {
        productsContainer.innerHTML = "<p>No products available.</p>";
    }

}