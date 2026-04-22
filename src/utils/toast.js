export function showToast(message, duration = 2500) {
  // reuse an existing toast if one is on screen
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  // force reflow so the transition runs even on rapid calls
  void toast.offsetWidth;
  toast.classList.add("show");

  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}
