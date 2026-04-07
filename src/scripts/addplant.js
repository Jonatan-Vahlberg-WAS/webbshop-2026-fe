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
});