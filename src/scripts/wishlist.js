import { updateCartCount } from "../utils/cartUtils.js";
import { requireAuth } from "../utils/auth.js";

export const updateWishlistCount = () => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistLink = document.querySelector("#wishlist-link");
  if (wishlistLink) {
    wishlistLink.innerHTML = `<i class="fa-solid fa-heart"></i> (${wishlist.length})`;
  }
};

const renderWishlistItems = () => {
  const wishlistContainer = document.querySelector("#wishlist-container");
  if (!wishlistContainer) return;

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = "<p>Your wishlist is empty</p>";
    return;
  }

  wishlistContainer.innerHTML = wishlist
    .map(
      (item, index) => `
        <article class="wishlist-card">
            <img class="wishlist-image" src="${item.image}" alt="${item.name}" />
            <p>Drop date: ${item.dropAt}</p>
            <div class="wishlist-card__body">
                <h3>${item.name}</h3>
                <p>Price: ${item.price}kr</p>
                <button class="add-to-cart" data-index="${index}">Add to cart</button>
                <button class="remove-wishlist-btn" data-index="${index}">Remove</button>
            </div>
        </article>
    `,
    )
    .join("");

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      if (!requireAuth("You need to be signed in to add items to your cart."))
        return;

      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const item = wishlist[button.dataset.index];

      const cartItem = {
        productId: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        size: null,
        quantity: 1,
      };

      let cart = JSON.parse(localStorage.getItem("cart"));
      if (cart === null) {
        cart = [];
      }

      const existingItem = cart.find((c) => c.productId === cartItem.productId);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    });
  });

  document.querySelectorAll(".remove-wishlist-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      wishlist.splice(button.dataset.index, 1);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      updateWishlistCount();
      renderWishlistItems();
    });
  });
};

updateWishlistCount();
renderWishlistItems();
