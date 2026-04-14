import { getCurrentUser, isLoggedIn, logoutUser, togglePassword } from "../utils/auth.js"
import { getMyOrders, updateUser } from "../utils/api.js"
import { formatDateISO, checkIfUserHasAddress } from "../utils/utility.js"

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
    orderDate.textContent = formatDateISO(order.createdAt);
    orderCard.appendChild(orderDate);

    order.products.forEach(product => {
        const productName = document.createElement("p");
        productName.textContent = product.name;
        orderCard.appendChild(productName);
    })

    const orderStatus = document.createElement("p");
    orderStatus.textContent = order.status;
    orderCard.appendChild(orderStatus);

    const orderQuantity = document.createElement("p");
    orderQuantity.textContent = `Amount: ${order.numOfItems}`;
    orderCard.appendChild(orderQuantity);

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