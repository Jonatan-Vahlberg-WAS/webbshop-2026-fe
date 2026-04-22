import { getOrdersByUser } from "../utils/ordersApi.js";
import { getProfile } from "../utils/userApi.js";
import { updateProfile } from "../utils/userApi.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".logoutBtn");

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    window.location.href = "/loginpage.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.querySelector(".settingsBtn");

  // Öppna/stäng menyn när man klickar på knappen
  settingsBtn.addEventListener("click", () => {
    document.getElementById("menu").classList.toggle("open");
  });

  // Stäng menyn om man klickar utanför
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.getElementById("menu").classList.remove("open");
    }
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const user = await getProfile();
  console.log("User:", user);

  const profileH1 = document.querySelector(".hello");
  profileH1.innerHTML = `<h1>Hello ${user.data.firstName} ${user.data.lastName}!</h1>`;

  const profilePage = document.querySelector(".profileContainer");

  async function showProfileView() {
    const orders = await getOrdersByUser();
    const latestOrder = orders.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )[0];

    profilePage.innerHTML = `
        <div id="profilePage">
            <div id="profile-pic">
                <img src="public/defaultpic.jpg" alt="Profilepic" class="profile-img" />
            </div>
            
            <div id="profile-wrapper">
                <div id="profile-info">
                    <h2 id="profile-h2">Your information</h2>
                    <p>Email: ${user.data.email}</p>
                    <p>Address: ${user.data.location.address}</p>
                    <p>City: ${user.data.location.city}</p>
                    <p>Postal code: ${user.data.location.postCode}</p>
                    <button id="edit">Edit information</button>
                </div>

                ${
                  user.data.role === "admin"
                    ? `
        <div id="admin-panel">
            <h2 id="profile-h2">Admin – Product Management</h2>
            <p>Create, update, and remove products through our admin panel.</p>
            <button id="edit" onclick="window.location.href='/admin.html'">To the admin page</button>
        </div>
    `
                    : ""
                }

                <div id="order-info">
                    <h2 id="profile-h2">Your most recent order:</h2>
                    ${
                      latestOrder
                        ? `
                      <div id="latest-order">
                        <p><b>Order ID:</b> ${latestOrder._id}</p>
                        <p><b>Order status:</b> ${latestOrder.orderStatus}</p>
                        <p><b>Date:</b> ${new Date(latestOrder.createdAt).toLocaleDateString()}</p>
                        <p><b>Items:</b></p>
                        <ul style="list-style: none; margin: 8px; padding: 0;">
                            ${latestOrder.items
                              .map(
                                (item) => `
                                <li style="padding-left: 4px;">- ${item.product.name} x${item.quantity} - ${item.unitPrice}:-</li>
                            `,
                              )
                              .join("")}
                        </ul>
                        <p><b>Total:</b> ${latestOrder.orderTotal}:-</p>
                      </div>
                    `
                        : `<p>No orders yet.</p>`
                    }
                    <button id="edit" onclick="window.location.href='/orders.html'">View all orders</button>
                </div>
            </div>
        </div>
        `;

    document.querySelector("#edit").addEventListener("click", showEditView);
  }

  function showEditView() {
    profilePage.innerHTML = `
        <div id="profilePage">
            <div id="profile-pic">
            <img src="public/defaultpic.jpg" alt="Profilepic" class="profile-img" />
            </div>
            <button id="back"><i class="fa-solid fa-circle-arrow-left"></i></button>
            <label for="email">Email: </label>
            <input type="text" placeholder="${user.data.email}" id="email" required /></input>
            <label for="address">Address: </label>
            <input type="text" placeholder="${user.data.location.address}" id="address" required /></input>
            <label for="city">City: </label>
            <input type="text" placeholder="${user.data.location.city}" id="city" required /></input>
            <label for="postCode">Postal code: </label>
            <input type="text" placeholder="${user.data.location.postCode}" id="postCode" required /></input>
            <button id="save">Save information</button>
        </div>
        `;

    document.querySelector("#back").addEventListener("click", () => {
      showProfileView();
    });

    document.querySelector("#save").addEventListener("click", async () => {
      const email = document.querySelector("#email").value;
      const address = document.querySelector("#address").value;
      const city = document.querySelector("#city").value;
      const postCode = document.querySelector("#postCode").value;

      try {
        const updated = await updateProfile({
          email,
          location: { address, city, postCode },
        });

        user.data = updated;
        showProfileView();
      } catch (error) {
        alert(error.message);
      }
    });
  }

  showProfileView();
});
