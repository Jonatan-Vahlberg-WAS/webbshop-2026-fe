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

function registerUser() {
  const data = validateFields();
  if (!data) return;

  const { name, email, password } = data;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some((u) => u.email === email)) {
    alert("Det finns redan ett konto med denna email");
    return;
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Konto skapat! Du kan nu logga in.");
  }