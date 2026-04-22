import { loginUser } from "../utils/userApi.js";
import { updateWishlistCount } from "./wishlist.js";
updateWishlistCount();

document.addEventListener("DOMContentLoaded", initLogin);

function initLogin() {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleLogin();
  });
}

async function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await loginUser(email, password);
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    window.location.href = "/index.html";
  } catch (error) {
    alert(error.message);
  }
}


/*document.addEventListener("DOMContentLoaded", () => {
  const forgotBtn = document.querySelector(".forgotBtn");
  const mainForgot = document.querySelector(".forgot-main");

  if (!forgotBtn || !mainForgot) return; // säkerhetscheck

  forgotBtn.addEventListener("click", () => {
    const oldPassword = document.querySelector("#password").value;
    const newPassword = document.querySelector("#newPassword").value;

    if (oldPassword === newPassword) {
      alert("You have to use a new password!");
    } else {
      mainForgot.innerHTML = `
        <h1>New password successful!</h1>
        <div id="forgot-container" class="forgot-wrapper">
          <form id="forgotForm" class="forgot-form">
            <div class="form-group">
              <p>Please check your email for confirmation!</p>
            </div>
            <div class="form-group">
              <label for="confirmation">Authentication code</label>
              <input 
                type="number" 
                minlength="6" 
                maxlength="6" 
                placeholder="Enter code" required
              />
            </div>
          </form>
        </div>
      `;
    }
  });
});*/
