export const addToCart = (userId, product) => {
  const cartKey = `cart_${userId}`;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  cart.push(product);
  localStorage.setItem(cartKey, JSON.stringify(cart));
};
//Function to show price in basket
let totalPricePrint = document.querySelector(".price");

export const countTotalPrice = () => {
  const cartItems = JSON.parse(localStorage.getItem(cart)) || [];

  let totalPrice = 0;
  cartItems.forEach((item) => {
    totalPrice = totalPrice + item.price;
  });
  totalPricePrint.innerText = totalPrice;
};
