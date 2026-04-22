const header = document.querySelector(".site-header");

header.innerHTML = `
    <nav class="underheader">
        <ul class="brand-links">
            <li><a href="products.html?brand=Nike">Nike</a></li>
            <li><a href="products.html?brand=Jordan">Jordan</a></li>
            <li><a href="products.html?brand=Adidas">Adidas</a></li>
            <li><a href="products.html?brand=New Balance">New Balance</a></li>
            <li><a href="products.html?brand=Crocs">Crocs</a></li>
        </ul>
    </nav>
    <nav class="overheader">
        <a href="index.html" class="logo">SOLE SEARCH.</a>
        <div class="header-links">
            <a href="products.html?dropStatus=Upcoming">Upcoming</a>
            <a href="products.html?dropStatus=Live">Live</a>
            <a href="products.html">All Sneakers</a>
        </div>
        <div class="nav-links">
            <div class="nav-icons">
                <a id="cart-link" href="shoppingcart.html"><i class="fa-solid fa-cart-shopping"></i>(0)</a>
                <li><a id="wishlist-link" href="wishlist.html"><i class="fa-solid fa-heart"></i></a></li>
                <a id="account-link" href="loginpage.html">Log In</a>
                </nav>
                `;

const ul = document.querySelector('.brand-links')
while (ul.scrollWidth < window.innerWidth * 2) {
    ul.innerHTML += ul.innerHTML
}

document.body.append(header);

document.addEventListener("DOMContentLoaded", () => {
  const accountLink = document.getElementById("account-link");
  const token = localStorage.getItem("token");

  if (token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        console.log(payload)
        const firstName = payload.firstName || "Account"
        accountLink.textContent = firstName
        accountLink.href = "/profilepage.html"
    } catch {
        accountLink.textContent = "Account"
        accountLink.href = "/profilepage.html"
    }
  }
});
