export async function sendOrder(event, form) {
  event.preventDefault();

  const products = JSON.parse(sessionStorage.getItem("cart") || "[]");

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  let totalSum = 59 * 1.12;
  products.forEach((product) => {
    totalSum += product.pris * product.amount * 1.12;
  });
  console.log("Cart products before map:", products);
  const produkter = products.map((product) => ({
    produktId: product._id,
    antal: product.amount,
  }));
  console.log("Produkter to send:", produkter);

  const payload = {
    produkter,
    totalsumma: totalSum,
    fornamn: data.namn,
    efternamn: data.efternamn,
    gatuadress: data.address,
    postnr: data.postnummer,
    postort: data.stad,
    mobil: data.tele,
    mejl: data.email,
    anmarkning: data.info,
  };

  // console.log(payload);
  // return {
  //   address: data.address,
  //   totalSum: totalSum,
  // };

  try {
    const response = await axios.post(
      "https://grupp-11-backend.vercel.app/api/orders",
      JSON.stringify(payload),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return {
      result: response.data,
      address: data.address,
      totalSum: totalSum,
    };
  } catch (error) {
    alert("Ett fel inträffade vid beställning.");
    console.error(error);
  }
}
