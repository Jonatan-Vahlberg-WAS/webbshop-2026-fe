const BASE_URL = 'http://localhost:3000'

// init login form
function initLogin() {
    const loginForm = document.getElementById('loginForm')
    if (!loginForm) return

    loginForm.addEventListener('submit', (event) => {
    event.preventDefault()
    handleLogin()
    })

    const toggleBtn = document.getElementById('toggle-login-password')
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () =>
        togglePassword('login-password', toggleBtn))
    }
}

// handle login form submission
async function handleLogin() {
    const email    = document.getElementById('login-email').value.trim()
    const password = document.getElementById('login-password').value
    const errorMsg = document.getElementById('login-error')
    const btn      = document.getElementById('login-submit-btn')

    // validation
    if (!email || !password) {
        errorMsg.textContent = 'Please fill in all fields.'
        return
    }

    errorMsg.textContent = ''
    btn.disabled = true
    btn.textContent = 'Signing in...'

    try {
    // ── db.json version ── will check for matching email and password in the users array
    const response = await axios.get(
    `${BASE_URL}/users?email=${email}&password=${password}`
    )

    if (response.data.length === 0) {
        errorMsg.textContent = 'Invalid email or password.'
        btn.disabled = false
        btn.textContent = 'Sign In'
        return
    }

        const user = response.data[0]

    // store token and user in localStorage
    // db.json doesn't have JWT — have to generate token with user id
    const fakeToken = 'mock-token-' + user.id
    localStorage.setItem('token', fakeToken)
    localStorage.setItem('user', JSON.stringify({
        id:      user.id,
        name:    user.name,
        email:   user.email,
        isAdmin: user.isAdmin
    }))

     // redirect by role
    if (user.isAdmin) {
        window.location.href = 'admin.html'
    } else {
        window.location.href = 'index.html'
    }

    // ── when backend is ready, we will use this instead ──
    // const response = await axios.post(`${BASE_URL}/auth/login`, {
    //   email,
    //   password
    // })
    // localStorage.setItem('token', response.data.token)
    // localStorage.setItem('user', JSON.stringify(response.data.user))
    // if (response.data.user.isAdmin) {
    //   window.location.href = 'admin.html'
    // } else {
    //   window.location.href = 'index.html'
    // }

    } catch (error) {
    errorMsg.textContent = 'Login failed. Please try again.'
    btn.disabled = false
    btn.textContent = 'Login'
}
}

// Logout function — clear localStorage and redirect to home page
function logoutUser() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = 'index.html'
}

// session management functions for checking login status and user role
function getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}

function isLoggedIn() {
    return !!localStorage.getItem('token')
}

function isAdmin() {
    const user = getCurrentUser()
    return user ? user.isAdmin : false
}

// navbar update function to show/hide links based on login status and role
function updateNavbar() {
    const user      = getCurrentUser()
    const loginLink = document.getElementById('nav-login')
    const adminLink = document.getElementById('nav-admin')

    if (user) {
        // logged in — แสดง email แทน username
        if (loginLink) loginLink.style.display = 'none'
        if (adminLink) adminLink.style.display = user.isAdmin ? 'inline' : 'none'
    } else {
        // not logged in
        if (loginLink) loginLink.style.display = 'inline'
        if (adminLink) adminLink.style.display = 'none'
    }
}

// toggle password visibility function for both login and register forms
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId)
    if (input.type === 'password') {
        input.type = 'text'
        btn.textContent = '🙈'
    } else {
        input.type = 'password'
        btn.textContent = '👀'
    }
}