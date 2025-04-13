// services/showProductsAdmin.js
import { deleteItem } from "./admin/deleteItem.js";

export function showProductsAdmin(products) {
  const container = document.querySelector("#productContainer");
  container.innerHTML = "";

  const table = document.createElement("table");
  table.classList.add("adminProductTable");

  // Table header
  table.innerHTML = `
      <thead>
        <tr>
          <th>Namn</th>
          <th>Kategori</th>
          <th>Varumärke</th>
          <th>Pris</th>
          <th>Mängd</th>
          <th>Jämförelsepris</th>
          <th>Leverantör</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
  const tbody = table.querySelector("tbody");

  const sortedProducts = products
    .slice()
    .sort((a, b) => a.namn.localeCompare(b.namn));
  sortedProducts.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${capitalize(product.namn)}</td>
        <td>${formatCategories(product.kategorier)}</td>
        <td>${
          typeof product.varumarke === "object"
            ? product.varumarke.namn
            : product.varumarke || "Saknas"
        }</td>
        <td>${product.pris}</td>
        <td>${product.mangd}</td>
        <td>${product.jamforpris}</td>
        <td>${capitalize(product.leverantor?.namn || "Saknas")}</td>
        <td><button class="editBtn">Redigera</button></td>
        <td><button class="deleteBtn">Radera</button></td>
      `;

    const deleteBtn = row.querySelector(".deleteBtn");
    const editBtn = row.querySelector(".editBtn");

    //DELETE
    deleteBtn.addEventListener("click", () => {
      deleteItem(product._id, product.namn);
    });
    //EDIT
    editBtn.addEventListener("click", () => {
      const form = document.getElementById("addProductsForm");
      form.style.display = "flex";

      document.getElementById("name").value = product.namn;
      document.getElementById("info").value = product.beskrivning;
      document.getElementById("price").value = product.pris;
      document.getElementById("category").value = product.kategorier
        .map((k) => k.namn)
        .join(", ");
      document.getElementById("ammount").value = product.mangd || "";
      document.getElementById("brand").value = product.varumarke?.namn || "";
      document.getElementById("content").value =
        product.innehallsforteckning || "";
      document.getElementById("compare").value = product.jamforpris
        ? parseFloat(
            String(product.jamforpris).replace(" kr/kg", "").replace(",", ".")
          )
        : "";
      document.getElementById("image").value = product.bild;
      document.getElementById("supplier").value =
        product.leverantor?.namn || "";

      sessionStorage.setItem("editProductId", product._id);

      //update button to show edit mode
      document.querySelector(".submitBtnDiv button").textContent =
        "Spara ändringar";
      const toggleFormBtn = (document.getElementById(
        "showFormBtn"
      ).textContent = "Göm formulär");
    });
    tbody.appendChild(row);
  });

  container.appendChild(table);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatCategories(kategorier) {
  if (Array.isArray(kategorier)) {
    return kategorier.map((k) => k.namn).join(", ");
  }
  return kategorier;
}
