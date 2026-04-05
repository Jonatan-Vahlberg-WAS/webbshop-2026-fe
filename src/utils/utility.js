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
