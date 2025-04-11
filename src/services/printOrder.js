export function printOrder() {
  const products = JSON.parse(sessionStorage.getItem("cart"));
  console.log(products);
  if (!products || products.length === 0) {
    alert("Din kundvagn är tom. Välj produkter för att gå vidare till kassan.");
  } else {
    const createDiv = document.createElement("div");
    createDiv.classList.add("productsContainer");
    const ul = document.createElement("ul");

    const heading = document.createElement("h2");
    heading.innerText = `PRODUKTER`;
    heading.classList.add("orderHeading");

    const productsContainer = createDiv;
    let sumProducts = 0;

    products.forEach((product) => {
      const li = document.createElement("li");
      const div = document.createElement("div");
      li.append(div);
      const title = document.createElement("p");
      title.classList.add("title");
      title.innerText = `${product.amount}st ${product.namn}`;
      // title.style.fontWeight = "bold";
      const price = document.createElement("p");
      price.classList.add("price");
      price.innerText = `${product.amount}st x ${product.pris} kr`;
      div.append(title, price);

      sumProducts += product.pris * product.amount;
      li.classList.add(`product`);
      ul.append(li);
    });

    const priceDiv = document.createElement("div");
    priceDiv.classList.add("priceDiv");

    let sumCont = document.createElement("div");
    sumCont.classList.add("sumCont");
    let sumTitle = document.createElement("p");
    sumTitle.classList.add("sumTitle");
    sumTitle.innerText = "Summa varor";
    let sum = document.createElement("p");
    sum.classList.add("sum");
    sum.innerText = `${sumProducts.toFixed(2)} kr`;
    sumCont.append(sumTitle, sum);

    let deliverCont = document.createElement("div");
    deliverCont.classList.add("deliverCont");
    let deliverTitle = document.createElement("p");
    deliverTitle.classList.add("deliverTitle");
    deliverTitle.innerText = "Leverans";
    let deliver = document.createElement("p");
    deliver.classList.add("deliver");
    deliver.innerText = `59 kr`;
    deliverCont.append(deliverTitle, deliver);

    let totalPriceSum = (sumProducts + 59) * 1.12;
    let totalCont = document.createElement("div");
    totalCont.classList.add("totalCont");
    let totalTitle = document.createElement("p");
    totalTitle.classList.add("totalPrice");
    totalTitle.innerText = `Totalsumma: `;
    let total = document.createElement("p");
    total.classList.add("total");
    total.innerText = `${totalPriceSum.toFixed(2)} kr`;
    totalCont.append(totalTitle, total);

    let momsCont = document.createElement("div");
    momsCont.classList.add("momsCont");
    let momsTitle = document.createElement("p");
    momsTitle.classList.add("momsTitle");
    momsTitle.innerText = "Moms (12%)";
    let moms = document.createElement("p");
    moms.classList.add("moms");
    moms.innerText = `${((sumProducts + 59) * 0.12).toFixed(2)} kr`;
    momsCont.append(momsTitle, moms);

    const payment = document.createElement("div");
    payment.classList.add("payment");
    const paymentTitle = document.createElement("p");
    paymentTitle.innerHTML = `Vänligen Swisha <span class="bold">${totalPriceSum.toFixed(
      2
    )} kr</span> till <span class="italic">+46 70 123 45 67</span>!`;
    payment.append(paymentTitle);

    priceDiv.append(sumCont, deliverCont, totalCont, momsCont);
    createDiv.append(heading, ul, priceDiv, payment);
    return createDiv;
  }
}
// [
// {"namn":"Päron Conference","beskrivning":"Conference päron från Belgien","pris":6.15,"kategorier":["frukter","ekologisk"],"bild":"https://brondsholm.se/27962-large_default/pron-13cm-grn-konstgjord-frukt.webp","mangd":"Ca 220g","varumarke":"Conference","innehallsforteckning":"Päron","jamforpris":"27,95 kr/kg","leverantor":"ICA","amount":1},{"namn":"Banan Eko","beskrivning":"gul banan från ecuador","pris":4.85,"kategorier":["frukter","ekologisk"],"bild":"https://handlaprivatkund.ica.se/images-v3/bf7a00ca-390e-4769-865f-dc369586872e/ba2f23d3-1525-45e7-9163-6a5671156f94/1280x1280.webp","mangd":"Ca 180g","varumarke":"Eko","innehallsforteckning":"Banan","jamforpris":"24,95 kr/kg","leverantor":"ICA","amount":3},{"namn":"Tomat kvist","beskrivning":"ekologisk röd tomat från Nederländerna","pris":5.87,"kategorier":["grönsaker","ekologisk"],"bild":"https://handlaprivatkund.ica.se/images-v3/bf7a00ca-390e-4769-865f-dc369586872e/8af94707-5620-444e-9682-5379fa521da4/1280x1280.webp","mangd":"Ca 250g","varumarke":"ICA","innehallsforteckning":"Tomat","jamforpris":"48,95 kr/kg","leverantor":"ICA","amount":1},
// {"namn":"Äpple Granny Smith","beskrivning":"Granny Smith äpple från Nya Zeeland","pris":6.45,"kategorier":["frukter","ekologisk"],"bild":"https://assets.axfood.se/image/upload/f_auto,t_500/07311042004738_C1C0_s01","mangd":"Ca 180g","varumarke":"Granny Smith","innehallsforteckning":"Äpple","jamforpris":"33,95 kr/kg","leverantor":"ICA","amount":5}]
