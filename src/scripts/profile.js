import { getCurrentUser, isLoggedIn, logoutUser, togglePassword } from "../utils/auth.js"
import { getMyOrders, updateUser, getProducts, getVariants } from "../utils/api.js"
import { formatDateISO, checkIfUserHasAddress, countdownTimer, addToCart } from "../utils/utility.js"

document.addEventListener('DOMContentLoaded', () => {

  // guard — if user is not logged in, redirect to login page
    if (!isLoggedIn()) {
        window.location.href = 'auth.html'
        return
    }

    loadProfile()
    editProfile()

    // logout button
    const logoutBtn = document.getElementById('logout-btn')
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser)
    }
})

async function loadProfile() {
    const user = getCurrentUser()
    if (!user) return

    const myOrders = await getMyOrders(user.id)
    renderMyOrders(myOrders)

    checkIfUserHasAddress('add-address', 'profile-address')

    // show user info on the profile page
    document.querySelector('.profile-name').textContent = user.name
    document.querySelector('.profile-email').textContent = user.email
    document.querySelector('.profile-password').textContent = `************`

    const allProducts = await getProducts();
    const allVariants = await getVariants();
    const userWishlist = user.wishlist || [];

    const wishlistItems = userWishlist.map(item => {
        const product = allProducts.find(product => product.id === item.productId);
        const variant = allVariants.find(variant => variant.id === item.variantId);
        return { product, variant };
    });

    renderWishlist(wishlistItems);
}

function renderMyOrders(orders) {
    const orderHistory = document.getElementById('order-history-list');

    if (orders.length === 0) {
        orderHistory.textContent = "You have no orders yet";
        return;
    }
    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        orderHistory.appendChild(orderCard);
    })
}

function createOrderCard(order) {
    const orderCard = document.createElement('div');
    orderCard.className = "order-card__body";

    const orderDate = document.createElement('p');
    orderDate.className = "order-date";
    orderDate.textContent = formatDateISO(order.createdAt);
    orderCard.appendChild(orderDate);

    const orderStatus = document.createElement("span");
    orderStatus.className = "order-status-badge";
    orderStatus.textContent = order.status;

    if (order.status === "pending") {
        orderStatus.classList.add("order-status--pending");
    } else if (order.status === "confirmed") {
        orderStatus.classList.add("order-status--confirmed");
    } else if (order.status === "shipped") {
        orderStatus.classList.add("order-status--shipped");
    } else if (order.status === "cancelled") {
        orderStatus.classList.add("order-status--cancelled");
    }

    orderStatus.style.color = "#ffff";
    orderStatus.style.padding = "3px 7px";
    orderStatus.style.borderRadius = "4px";
    orderCard.appendChild(orderStatus);

    order.products.forEach(product => {
        const productInfo = document.createElement("p");
        productInfo.textContent = `${product.name} — Size ${product.size} — $${product.price.toFixed(2)}`;
        orderCard.appendChild(productInfo);
    })

    const orderTotal = document.createElement('p');
    orderTotal.className = "order-total";
    orderTotal.textContent = `Total: $${order.totalCost.toFixed(2)} (${order.numOfItems} items)`;
    orderCard.appendChild(orderTotal);

    return orderCard;
}

function editProfile() {

    const editSection = document.getElementById('profile-edit-section');
    const infoSection = document.getElementById('profile-info-section');

    const btnEdit = document.getElementById('edit-profile-btn');
    const btnCancel = document.getElementById('cancel-edit-btn');
    const btnSave = document.getElementById('save-profile-btn');

    btnEdit.addEventListener('click', () => {
        const user = getCurrentUser()

        if (editSection.classList.contains('hidden')) {
            editSection.classList.remove('hidden');
            infoSection.classList.add('hidden');
            btnEdit.textContent = "Cancel edit";

            document.getElementById('edit-name').value = user.name;
            document.getElementById('edit-email').value = user.email;

            if (user.address) {
            document.getElementById('edit-street').value = user.address.street;
            document.getElementById('edit-postal-code').value = user.address.postal_code;
            document.getElementById('edit-city').value = user.address.city;
            document.getElementById('edit-country').value = user.address.country;
            }

        } else {
            editSection.classList.add('hidden');
            infoSection.classList.remove('hidden');
            btnEdit.textContent = "Edit Profile";
        }

    })

    btnCancel.addEventListener('click', () => {
        editSection.classList.add('hidden');
        infoSection.classList.remove('hidden');
        btnEdit.textContent = "Edit Profile";

    })

    btnSave.addEventListener('click', async (event) => {
        event.preventDefault();
        const user = getCurrentUser()

        const nameError = document.querySelector('.name-error');
        const emailError = document.querySelector('.email-error');
        const passwordError = document.querySelector('.password-error');

        nameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";

        const name = document.getElementById('edit-name').value;
        const email = document.getElementById('edit-email').value;
        const street = document.getElementById('edit-street').value;
        const postalCode = document.getElementById('edit-postal-code').value;
        const city = document.getElementById('edit-city').value;
        const country = document.getElementById('edit-country').value;
        const editPassword = document.getElementById('edit-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!name) {
            nameError.textContent = `Please enter a name`;
            return
        }

        if (!email) {
            emailError.textContent = `Please enter an email address`;
            return
        }

        if (editPassword) {
            if (editPassword.length < 8) {
                passwordError.textContent = "Password must be at least 8 characters.";
                return
            }
            if (!/[A-Z]/.test(editPassword)) {
                passwordError.textContent = "Password must contain at least one capital letter.";
                return
            }
            if (!/[0-9]/.test(editPassword)) {
                passwordError.textContent = "Password must contain at least one number.";
                return
            }
            if (!/[!@#$%&*]/.test(editPassword)) {
                passwordError.textContent = "Password must contain at least one special character (! @ # $ % & *).";
                return
            }
            if (editPassword !== confirmPassword) {
                passwordError.textContent = "Passwords do not match!";
                return
            }
        }

        const updatedUser = {
            ...user,
            name: name,
            email: email,
            address: {
                street: street,
                postal_code: postalCode,
                city: city,
                country: country
            }
        }

        if (editPassword) {
            updatedUser.password = editPassword;
        }

        const result = await updateUser(updatedUser);
        const saveSuccess = document.querySelector('.save-success');
        const saveError = document.querySelector('.save-error');

        if (result) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // NOTE: saveSuccess message and switch from edit to profile view may not be visible because
            // Live Server reloads the page when db.json changes.
            // This won't be an issue with the real API.
            saveSuccess.textContent = `Save successful`
            await loadProfile()
            editSection.classList.add('hidden');
            infoSection.classList.remove('hidden');
            btnEdit.textContent = "Edit Profile";
            setTimeout(() => {
                saveSuccess.textContent = ""
            }, 5000)
        } else {
            saveError.textContent = `Save failed. Try again later`
        }

    })

    document.getElementById('edit-password').addEventListener('input', checkEditPasswordRules);
    const toggleEditPw = document.getElementById('toggle-edit-password');
    toggleEditPw.addEventListener('click', () => togglePassword('edit-password', toggleEditPw));

}

function checkEditPasswordRules() {
    const password = document.getElementById('edit-password').value;

    const rules = {
        "edit-req-length": password.length >= 8,
        "edit-req-upper": /[A-Z]/.test(password),
        "edit-req-number": /[0-9]/.test(password),
        "edit-req-special": /[!@#$%&*]/.test(password),
    };

    for (const [id, passed] of Object.entries(rules)) {
        const el = document.getElementById(id);
        el.style.color = passed ? "green" : "";
    }
}

function renderWishlist(wishlistItems) {
    const wishlistContainer = document.getElementById('wishlist-list');

    if (wishlistItems.length === 0) {
        wishlistContainer.textContent = `Your wishlist is empty`;
        return;
    }

    wishlistItems.forEach(({ product, variant }) => {
        const wishlistCard = createWishlistCard(product, variant);
        wishlistContainer.appendChild(wishlistCard);
    })
}

function createWishlistCard(product, variant) {
    const wishlistCard = document.createElement('div');
    wishlistCard.className = "wishlist-card";

    const imageSectionWishlist = document.createElement('div');
    imageSectionWishlist.className = "image-wrapper-wishlist";

    if (product.image) {
        const image = document.createElement('img');
        image.className = "wishlist-card__image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";
        
        imageSectionWishlist.appendChild(image);
    } else {
        const image = document.createElement('div');
        image.className = "wishlist-card__image-placeholder";
        image.textContent = "👟";

        imageSectionWishlist.appendChild(image);
    }

    let statusElement;
    if (product.status === "upcoming") {
        statusElement = document.createElement("p");
        statusElement.className = "drop-timer";
        //Add timer to product card
        countdownTimer(product.dropDate, statusElement);
    } else if (product.status === "live") {
        statusElement = document.createElement("button");
        statusElement.className = "status-btn";
        statusElement.textContent = "Buy Now";

        statusElement.addEventListener('click', () => {
            const result = addToCart(product.id, variant.id, variant.size);
            console.log(result);

            if(result.success) {
                statusElement.textContent = "Added to Cart";
                statusElement.disabled = true;
                setTimeout(() => {
                    statusElement.textContent = "Buy Now";
                    statusElement.disabled = false;
                }, 3000)
            } else if (result.error === "duplicate_size") {
                statusElement.textContent = "Already in Cart";
                statusElement.disabled = true;
                setTimeout(() => {
                    statusElement.textContent = "Buy Now";
                    statusElement.disabled = false;
                }, 3000)
            }
        })
    } else {
        statusElement = document.createElement("button");
        statusElement.className = "status-btn";
        statusElement.disabled = true;
        statusElement.textContent = `Sold Out`;
    }

    const wishlistCardBody = document.createElement('div');
    wishlistCardBody.className = "wishlist-card__body";

    const name = document.createElement('h3');
    name.textContent = product.name;
    const price = document.createElement('p');
    price.className = "wishlist-card__price";
    price.textContent = `$${product.price.toFixed(2)}`;
    const size = document.createElement('p');
    size.className = "wishlist-card__size";
    size.textContent = `Size: ${variant.size}`;

    wishlistCardBody.appendChild(name);
    wishlistCardBody.appendChild(price);
    wishlistCardBody.appendChild(size);
    wishlistCardBody.appendChild(statusElement);
    
    wishlistCard.appendChild(imageSectionWishlist);
    wishlistCard.appendChild(wishlistCardBody);
    
    return wishlistCard;
}