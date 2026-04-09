document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("loggedIn"));

  // Om ingen är inloggad - skicka till login
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // välkomsttext
  document.getElementById("welcome-text").textContent = `Välkommen, ${user.name}!`;

  // Ändra nav-knappen till Logga ut
  const navRight = document.querySelector(".nav-right a");
  navRight.textContent = "Logga ut";
  navRight.href = "#";

  navRight.addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "index.html";
  });
});
