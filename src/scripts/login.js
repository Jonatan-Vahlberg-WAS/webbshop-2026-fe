document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("loginSection");
  const registerSection = document.getElementById("registerSection");
  const openRegisterLink = document.getElementById("openRegisterModal");
  const showLoginLink = document.getElementById("showLogin");
  const closeLoginBtn = document.getElementById("closeLogin");
  const closeRegisterBtn = document.getElementById("closeRegister");

  // switch
  openRegisterLink?.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
  });

  showLoginLink?.addEventListener("click", (e) => {
    e.preventDefault();
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
  });

  // // close btn
  // closeLoginBtn?.addEventListener("click", () => {
  //   loginSection.classList.add("hidden");
  // });

  // closeRegisterBtn?.addEventListener("click", () => {
  //   registerSection.classList.add("hidden");
  // });

  // 
closeLoginBtn?.addEventListener("click", () => {
  window.location.href = "/index.html";
});

closeRegisterBtn?.addEventListener("click", () => {
  window.location.href = "/index.html";
});


  // log in 
  document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    try {
      const res = await fetch("https://grupp-3.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.accessToken) {
        sessionStorage.setItem("token", data.accessToken);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        alert(`Välkommen ${data.user.firstName}`);

        setTimeout(() => {
          const role = data.user.role?.toLowerCase();
          if (role === "admin") {
            window.location.href = "admin.html";
          } else {
            window.location.href = "index.html";
          }
        }, 100);
      } else {
        alert(data.message || "Inloggning misslyckades.");
      }
    } catch (err) {
      console.error("Fel vid inloggning:", err);
      alert("Något gick fel vid inloggning");
    }
  });

  // registering 
  document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const firstName = document.getElementById("reg-firstname").value.trim();
    const lastName = document.getElementById("reg-lastname").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const confirmEmail = document.getElementById("reg-email-confirm").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const confirmPassword = document.getElementById("reg-password2").value.trim();

    const nameRegex = /^[A-Za-zÅÄÖåäö]{2,}$/;

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      return alert("Förnamn och efternamn får inte innehålla siffror");
    }

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
      console.error("Fel vid registrering:", err);
      alert("Något gick fel vid registrering");
    }
  });
});

