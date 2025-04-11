export async function fetchOrders() {
  try {
    const response = await axios.get(
      "https://grupp-11-backend.vercel.app/api/orders",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    alert("Ett fel inträffade vid hämtningen av orders.");
    console.error(error);
  }
}
