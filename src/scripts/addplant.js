
const form = document.getElementById("plantForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // get values
  const name = document.getElementById("plantName").value;
  const image = document.getElementById("plantImage").value;
  const location = document.getElementById("plantLocation").value;
  const light = document.getElementById("lightLevel").value;

  // create object
  const newPlant = {
    name,
    image,
    location,
    light
  };

  // get existing plants
  const plants = JSON.parse(localStorage.getItem("plants")) || [];

  // add new plant
  plants.push(newPlant);

  // save back
  localStorage.setItem("plants", JSON.stringify(plants));

  console.log("Saved plant:", newPlant);

  // reset form
  form.reset();

  // hide form
  form.style.display = "none";

  // show confirmation
  const confirmation = document.getElementById("confirmation");
  if (confirmation) {
    confirmation.style.display = "block";
  }
});


// navigation buttons
const goMapBtn = document.getElementById("goMap");
const goHomeBtn = document.getElementById("goHome");

if (goMapBtn) {
  goMapBtn.addEventListener("click", () => {
    window.location.href = "/map.html";
  });
}

if (goHomeBtn) {
  goHomeBtn.addEventListener("click", () => {
    window.location.href = "/index.html";
  });
}