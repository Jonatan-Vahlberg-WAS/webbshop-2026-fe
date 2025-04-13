import { showProductsAdmin } from "../showProductsAdmin.js";
import { fetchProducts } from "../../utils/api.js";

export async function editData(updatedData, id) {
    
  try {
    const response = await axios.put(`https://grupp-11-backend.vercel.app/api/products/${id}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`
      }
    });

    if (response.status === 200) {
      alert(`Produkten "${updatedData.namn}" har uppdaterats.`);
      let products = await fetchProducts();
      showProductsAdmin(products);
    }

    console.log(response.status);
  } catch (error) {
    console.log("Något gick fel: " + error);
  }
  }
 