import { getCurrentUser, isLoggedIn, logoutUser } from "../utils/auth.js"
import { getMyOrders } from "../utils/api.js"
import { formatDateISO } from "../utils/utility.js"

document.addEventListener('DOMContentLoaded', () => {

  // guard — if user is not logged in, redirect to login page
    if (!isLoggedIn()) {
        window.location.href = 'auth.html'
        return
    }

    loadProfile()

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

    // show user info on the profile page
    document.getElementById('profile-name').textContent = user.name
    // TODO: add profile-email element to HTML
    // document.getElementById('profile-email').textContent = user.email
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

    const orderName = document.createElement("h3");
    orderName.textContent = order.productId; //TODO: replace with product name when fetching product details

    const orderStatus = document.createElement("p");
    orderStatus.textContent = order.status;

    const orderQuantity = document.createElement("p");
    orderQuantity.textContent = `Amount: ${order.quantity}`;

    orderCard.appendChild(orderDate);
    orderCard.appendChild(orderName);
    orderCard.appendChild(orderStatus);
    orderCard.appendChild(orderQuantity);

    return orderCard;
}
