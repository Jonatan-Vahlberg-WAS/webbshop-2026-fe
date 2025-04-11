import { showProductsAdmin } from "../showProductsAdmin.js";
import { fetchProducts } from "../../utils/api.js";

export async function deleteOrder(id, namn) {
  const confirmed = confirm(
    `Är du säker på att du vill radera ${namn}s beställning?`
  );

  if (!confirmed) return;

  try {
    const response = await axios.delete(
      `https://grupp-11-backend.vercel.app/api/orders/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
      }
    );

    if (response.status === 200) {
      alert(`${namn}s beställning har raderats.`);
      let products = await fetchProducts();
      showProductsAdmin(products);
    }

    console.log(response.status);
  } catch (error) {
    console.log("Något gick fel: " + error);
  }
}
