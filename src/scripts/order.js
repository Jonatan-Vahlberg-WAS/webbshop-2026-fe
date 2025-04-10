let shoppingCart = JSON.parse(localStorage.getItem("Products"));
const cartContainer = document.querySelector("#shoppingCartContent");

cartContainer.innerHTML = "";
const element = document.createElement("h2");
element.innerHTML = `Varukorg`;
cartContainer.appendChild(element);

if (shoppingCart) {
  shoppingCart.forEach((product) => {
    const element = document.createElement("div");
    element.className = "shopping-cart-item";
    element.innerHTML = `
    <div class="shopping-cart-item-info">
        <div>${product.title}</div>
        <div>${product.price.toFixed(2)} kr</div>
    </div> 
    `;
    cartContainer.appendChild(element);
  });

  let totOrderPrice = 0;
  let orderItems = [];

  shoppingCart.forEach((product) => {
    totOrderPrice += product.price;
    let productQuantity = 0;
    let productExists = 0;

    shoppingCart.forEach((productList) => {
      if (product.title === productList.title) {
        productQuantity++;
      }
    });

    productExists = 0;
    orderItems.forEach((item) => {
      if (item.productId === product._id) {
        productExists++;
      }
    });

    if (productExists === 0) {
      productExists = 0;
      let item = {
        productId: product._id,
        quantity: productQuantity,
      };
      orderItems.push(item);
    }
  });

  const element = document.createElement("div");
  element.className = "shopping-cart-item";
  element.innerHTML = `
    <div class="shopping-cart-item-info-tot-price">
        <div>Totalt:</div>
        <div>${totOrderPrice.toFixed(2)} kr</div>
    </div> 
    `;
  cartContainer.appendChild(element);

  const userSessionStorageData = JSON.parse(sessionStorage.getItem("user"));

  if (userSessionStorageData) {
    document.getElementById("firstname").defaultValue =
      userSessionStorageData.firstName;
    document.getElementById("email").defaultValue =
      userSessionStorageData.email;
  }

  const formElem = document.querySelector("form");

  formElem.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(formElem);

    const userData = {
      email: formData.get("email"),
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      phonenumber: formData.get("phonenumber"),
      shippingAddress: {
        street: formData.get("street"),
        number: formData.get("number"),
        zipCode: formData.get("zipCode"),
        city: formData.get("city"),
      },
      orderItem: orderItems,
    };
    console.log(userData);
    //const jwt = sessionStorage.getItem("token");
    const apiUrl = "https://grupp-3.vercel.app/api/orders/";

    axios
      .post(apiUrl, userData)
      .then((response) => {
        console.log("Response:", response.data);
        alert("Din order är mottagen.");
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      });

    formElem.reset();
  });
}
