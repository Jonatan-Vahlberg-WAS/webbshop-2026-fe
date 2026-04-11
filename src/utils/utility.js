import { getCurrentUser, isLoggedIn } from "../utils/auth.js";

export function formatDateISO(isoString) {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // convert 0 -> 12 for 12AM

  return `${day}-${month}-${year}, ${hours}:${minutes} ${ampm}`;
}

//Temporary code to generate objectIDs to mimick mongodb _id
export function generateObjectId() {
  const hexChars = "0123456789abcdef";
  let objectId = "";

  for (let i = 0; i < 24; i++) {
    objectId += hexChars[Math.floor(Math.random() * 16)];
  }

  return objectId;
}

//This function gets how much time is left
export function getTimeLeft(releaseDate) {
  const dropDate = new Date(releaseDate);
  const now = new Date();

  // Calculate total milliseconds difference
  let diff = dropDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  // Extract units
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  const seconds = Math.floor(diff / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

//This function just renders the time left
export function renderTimer(timeLeft, timerContainer) {
  if (timeLeft.isExpired) {
    timerContainer.style.display = "none";
    return;
  }

  const { days, hours, minutes, seconds } = timeLeft;

  timerContainer.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s left`;
}

//Starts a countdown timer that updates the container every second until the release date.
export function countdownTimer(releaseDate, container) {
  function tick() {
    const timeLeft = getTimeLeft(releaseDate);
    renderTimer(timeLeft, container);

    if (timeLeft.isExpired) return;

    //Align to next second (prevents drift)
    const now = Date.now();
    const delay = 1000 - (now % 1000);

    setTimeout(tick, delay);
  }

  tick(); // start immediately
}

//Adds product to cart
export function addToCart(productId, size) {
  if (!isLoggedIn()) {
    return { success: false, error: "not_logged_in" };
  } else {
    const user = getCurrentUser();
    if (!user) return;
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if this product & size already exist for the current user
    const exists = cart.some(
      (item) =>
        item.userId === user.id &&
        item.productId === productId &&
        item.size === size,
    );

    if (exists) {
      return { success: false, error: "duplicate_size" };
    }

    const cartItem = {
      userId: user.id,
      productId,
      size,
    };

    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    return { success: true, cartItem };
  }
}

//Checks if the user has a saved address or not
export function checkUserAddress() {
  const user = getCurrentUser();
  console.log("USER:", user);

  return !!user?.address;
}

//Function that renders the address if a user has one
export function checkIfUserHasAddress(elementToHide, renderElement) {
  const hasAddress = checkUserAddress();
  const element = document.querySelector(`.${elementToHide}`);

  if (hasAddress) {
    element.style.display = "none";

    const user = getCurrentUser();

    const userAddress = document.querySelector(`.${renderElement}`);

    const name = document.createElement("p");
    const addressLineOne = document.createElement("p");
    const addressLineTwo = document.createElement("p");

    name.innerText = user.name;
    addressLineOne.innerText = `${user.address.street}, ${user.address.city}`;
    addressLineTwo.innerText = `${user.address.postal_code}, ${user.address.country}`;
    userAddress.append(name, addressLineOne, addressLineTwo);
  }
}
