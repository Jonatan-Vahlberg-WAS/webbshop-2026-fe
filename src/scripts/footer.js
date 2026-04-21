const footer = document.querySelector(".site-footer");

footer.innerHTML = `
    <div class="footer-content">
        <div class="footer-links">
            <p>SOLE SEARCH <i class="fa-brands fa-tiktok"></i></p>
            <p>Sole street 11, 404 04 London</p>
            <p>&copy; 2026 Sole Search, Inc. All rights reserved.</p>
        </div>
        <div class="footer-links">
            <a href="/about">About</a>
            <a href="contact.html">Contact</a>
            <a href="/sales">Sales</a>
            <a href="/news">News</a>
            <a href="/blog">Blog</a>
        </div>
        <div class="footer-links">
            <a href="policypage.html">Terms & Policies</a>
            <a href="/delivery">Shipping & Delivery</a>
            <a href="/returns">Returns & Exchanges</a>
            <a href="/tracking">Track your order</a>
            <a href="/size">Size guide</a>
        </div>
        <div class="footer-links">
            <a href="/socialmedia">Social media</a>
            <a href="/faq">FAQ</a>
            <a href="/complaints">Help</a>
            <a href="/payment">Payment methods</a>
            <a href="/access">Accessibility information</a>
        </div>
    </div>`;

document.body.append(footer);