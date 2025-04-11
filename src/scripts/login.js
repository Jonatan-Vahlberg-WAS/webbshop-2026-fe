
document.addEventListener("DOMContentLoaded", initLogin);

function initLogin() {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleLogin();
  });
}

async function handleLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const url = "https://grupp-11-backend.vercel.app/api/auth/login"
  try{
    const loginDetails = {
      username: `${username}`,
      password: `${password}`
    }

    const response = await axios.post(url, loginDetails);
    if(response.status === 200){
      sessionStorage.setItem("jwt", response.data.token);
      window.location.href = "/HTML/admin.html";
    }
    

  }catch(error){
    alert("Password or Username is invalid");
  }
}
