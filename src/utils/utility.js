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

//This function ticks each second, the actual timer
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
