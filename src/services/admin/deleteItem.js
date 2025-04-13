import { showProductsAdmin } from "../showProductsAdmin.js";
import { fetchProducts } from "../../utils/api.js";

export async function deleteItem(id, namn) {
    
    const confirmed = confirm(`Är du säker på att du vill radera "${namn}"?`);
  
    if (!confirmed) return; 
  
    try {
      const response = await axios.delete(`https://grupp-11-backend.vercel.app/api/products/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
        }
      });
  
      if (response.status === 200) {
        alert(`Produkten "${namn}" har raderats.`);
        let products = await fetchProducts();
        showProductsAdmin(products);
      }
  
      console.log(response.status);
    } catch (error) {
      console.log("Något gick fel: " + error);
    }
  }