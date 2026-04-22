export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const updateCartCount = () => {
  const cart = getCart();

  const totalCount = cart.reduce((sum, item) => {
    return sum + (item.quantity || 0);
  }, 0);

  const cartLink = document.querySelector("#cart-link");

  if (cartLink) {
    cartLink.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>(${totalCount})`;
  }
};
