import { updateCartCount } from "../utils/cartUtils.js";
import { requireAuth } from "../utils/auth.js";
import { showToast } from "../utils/toast.js";
updateCartCount();

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
        <div class="wishlist-item-wrapper">
        <a class="product-href" href="product.html?slug=${item.slug}">
          <article class="product-card">
            <div class="product-card__image"
              style="background-image: url('${item.image}')">
                <p class="products-card-drop-status">${item.dropAt}</p>
                <div>
                  <h3 class="product-card__name">${item.name}</h3>
                  <p class="product-card__price">${item.price}:-</p>
                </div>
            </div>
          </article>
        </a>
        <button class="btn-primary remove-wishlist-btn" data-index="${index}">
          Remove from wishlist
        </button>
      </div>
      `,
    )
    .join("");

  document.querySelectorAll(".remove-wishlist-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault(); // prevent navigating via the <a> tag
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
