import { getCurrentUser, isLoggedIn, logoutUser } from "../utils/auth.js"

document.addEventListener('DOMContentLoaded', () => {

  // guard — if user is not logged in, redirect to login page
    if (!isLoggedIn()) {
        window.location.href = 'auth.html'
        return
    }

    loadProfile()

    // logout button
    document.getElementById('logout-btn')
        .addEventListener('click', logoutUser)
    })

function loadProfile() {
    const user = getCurrentUser()
    if (!user) return

    // show user info on the profile page
    document.getElementById('profile-name').textContent = user.name
    document.getElementById('profile-email').textContent = user.email
}