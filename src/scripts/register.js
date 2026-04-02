document.addEventListener("DOMContentLoaded", initRegister);

function initRegister() {
  const registerForm = document.getElementById("registerForm");
  const skapaKontoLink = document.querySelector(".skapa-konto");
  const loginButton = registerForm.querySelector("button[type='submit']");

// Logga in
  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    loginUser();
  });

  // Skapa konto
  skapaKontoLink.addEventListener("click", (e) => {
    e.preventDefault();
    registerUser();
  });
}

//alert för fältvalidering
function validateFields() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("Alla fält måste fyllas i");
    return false;
  }

  return { name, email, password };
}
