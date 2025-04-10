document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("loginSection");
  const registerSection = document.getElementById("registerSection");
  const openRegisterLink = document.getElementById("openRegisterModal");
  const showLoginLink = document.getElementById("showLogin");
  const closeLoginBtn = document.getElementById("closeLoginModal");
  const closeRegisterBtn = document.getElementById("closeRegisterModal");

  openRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
  });

  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
  });

  closeLoginBtn.addEventListener("click", () => {
    loginSection.classList.add("hidden");
  });

  closeRegisterBtn.addEventListener("click", () => {
    registerSection.classList.add("hidden");
  });

  // Log in 
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const res = await fetch("https://grupp-3.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
   
        console.log(" accessToken received:");

        sessionStorage.setItem("token", data.accessToken);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        alert(`Välkommen ${data.user.firstName}`);
        window.location.href =
          data.user.role === "admin" ? "admin.html" : "index.html";
      } else {
        alert(data.message || "Fel vid inloggning");
      }
    } catch (err) {
      alert("Något gick fel vid inloggning");
    }
  });

  // Registering
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const firstName = document.getElementById("reg-firstname").value;
    const lastName = document.getElementById("reg-lastname").value;
    const email = document.getElementById("reg-email").value;
    const confirmEmail = document.getElementById("reg-email-confirm").value;
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-password2").value;

    if (email !== confirmEmail) return alert("E-post matchar inte");
    if (password !== confirmPassword) return alert("Lösenord matchar inte");

    try {
      const res = await fetch("https://grupp-3.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registreringen lyckades. Du kan nu logga in.");
        registerSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
      } else {
        alert(data.message || "Något gick fel vid registrering");
      }
    } catch (err) {
      alert("Något gick fel vid registrering");
    }
  });
});
