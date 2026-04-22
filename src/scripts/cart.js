import { getCart, saveCart, updateCartCount } from "../utils/cartUtils.js";
updateCartCount();

const renderCartItems = () => {
  const cartContainer = document.querySelector("#cart-items");
  const cartTotal = document.querySelector("#cart-total");

  if (!cartContainer) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty</p>";

    if (cartTotal) {
      cartTotal.textContent = "";
    }
    return;
  }

  cartContainer.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}"/>
            <h3>${item.name}</h3>
            <p>Size: ${item.size}</p>
            <p>Price: ${item.price}kr</p>
            <button class="decrease" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="increase" data-index="${index}">+</button>
            <button class="remove-btn" data-index="${index}">Remove</button>
        </div>   
    `,
    )
    .join("");

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  if (cartTotal) {
    cartTotal.textContent = `Total: ${total}kr`;
  }
  const removeButtons = cartContainer.querySelectorAll(".remove-btn");

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = button.dataset.index;

      cart.splice(index, 1);

      saveCart(cart);
      updateCartCount();
      renderCartItems();
    });
  });

  const increaseButtons = cartContainer.querySelectorAll(".increase");
  increaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const cart = getCart();
      const index = Number(button.dataset.index);
      cart[index].quantity++;

      saveCart(cart);
      updateCartCount();
      renderCartItems();
    });
  });

  const decreaseButtons = cartContainer.querySelectorAll(".decrease");
  decreaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const cart = getCart();
      const index = Number(button.dataset.index);
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      }

      saveCart(cart);
      updateCartCount();
      renderCartItems();
    });
  });
};

updateCartCount();
renderCartItems();
