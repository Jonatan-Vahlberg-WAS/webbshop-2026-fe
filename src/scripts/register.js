document.addEventListener("DOMContentLoaded", initRegister);

function initRegister() {
  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleRegister();
  });
}

async function handleRegister() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("Alla fält måste fyllas i");
    return;
  }
}
