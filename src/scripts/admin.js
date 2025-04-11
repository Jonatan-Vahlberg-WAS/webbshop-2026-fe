import { fetchProducts } from "../utils/api.js";
import { showProductsAdmin } from "../services/showProductsAdmin.js";
import { productList } from "../../tempTestData/products.js";
import { searchProduct } from "../services/searchProduct.js";
import { editData } from "../services/admin/editData.js";
import { fetchOrders } from "../services/fetchOrders.js";
import { showOrdersAdmin } from "../services/admin/showOrdersAdmin.js";

export let products;

export function printProductsAdminpage() {
  document.querySelector(".admin-content").innerHTML = "";
  const main = document.createElement("main");
  main.classList.add("admin-container");

  const showFormBtn = document.createElement("button");
  showFormBtn.id = "showFormBtn";
  showFormBtn.textContent = "Lägg till Produkt";

  const form = document.createElement("form");
  form.id = "addProductsForm";
  form.action = "/upload";
  form.method = "POST";
  form.enctype = "multipart/form-data";
  form.style.display = "none";

  // Form Part 1
  const formPart1 = document.createElement("div");
  formPart1.classList.add("formPart1");

  const fields1 = [
    { label: "Produktnamn:", type: "text", id: "name", name: "name" },
    { label: "Beskrivning:", type: "textarea", id: "info", name: "info" },
    {
      label: "Pris:",
      type: "number",
      id: "price",
      name: "price",
      step: "0.01",
      min: "0.5",
      max: "9999",
    },
    {
      label: "Kategori(er):",
      type: "text",
      id: "category",
      name: "category",
      placeholder: "Frukter, Ekologiskt",
    },
    { label: "Bild:", type: "text", id: "image", name: "image" },
  ];

  fields1.forEach(({ label, type, ...attrs }) => {
    const lbl = document.createElement("label");
    lbl.setAttribute("for", attrs.id);
    lbl.textContent = label;

    const input =
      type === "textarea"
        ? document.createElement("textarea")
        : document.createElement("input");
    if (type !== "textarea") input.type = type;
    Object.entries(attrs).forEach(([k, v]) => input.setAttribute(k, v));
    input.required = true;

    formPart1.append(lbl, input);
  });

  // Form Part 2
  const formPart2 = document.createElement("div");
  formPart2.classList.add("formPart2");

  const fields2 = [
    { label: "Mängd:", id: "ammount", name: "ammount" },
    { label: "Varumärke:", id: "brand", name: "brand" },
    { label: "Innehållsförteckning:", id: "content", name: "content" },
    {
      label: "Jämförelsepris:",
      type: "number",
      id: "compare",
      name: "compare",
      step: "0.01",
      min: "0.01",
      max: "9999",
    },
    { label: "Leverantör:", id: "supplier", name: "supplier" },
  ];

  fields2.forEach(({ label, type = "text", ...attrs }) => {
    const lbl = document.createElement("label");
    lbl.setAttribute("for", attrs.id);
    lbl.textContent = label;

    const input = document.createElement("input");
    input.type = type;
    Object.entries(attrs).forEach(([k, v]) => input.setAttribute(k, v));
    input.required = true;

    formPart2.append(lbl, input);
  });

  // Submit Button
  const submitDiv = document.createElement("div");
  submitDiv.classList.add("submitBtnDiv");

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Lägg Till";

  submitDiv.appendChild(submitBtn);

  // Append all
  form.append(formPart1, formPart2, submitDiv);

  const productContainer = document.createElement("div");
  productContainer.id = "productContainer";
  productContainer.innerHTML = "<p>Error loading products.</p>";

  main.append(showFormBtn, form, productContainer);

  document.querySelector(".admin-content").append(main);
  loadProducts();
}

export async function printOrdersAdminpage() {
  const adminContent = document.querySelector(".admin-content");
  adminContent.innerHTML = "";
  const main = document.createElement("main");
  main.classList.add("admin-container");
  adminContent.append(main);

  const showingProductCont = document.createElement("div");
  showingProductCont.id = "showingProductCont";

  const productContainer = document.createElement("div");
  productContainer.id = "productContainer";
  main.append(showingProductCont, productContainer);

  const orders = await fetchOrders();
  showOrdersAdmin(orders);
}

const printproductsAddEventlisteners = () => {
  printProductsAdminpage();

  const toggleFormBtn = document.getElementById("showFormBtn");
  const form = document.getElementById("addProductsForm");

  toggleFormBtn.addEventListener("click", () => {
    const isVisible = form.style.display === "flex";
    form.style.display = isVisible ? "none" : "flex";
    toggleFormBtn.textContent = isVisible
      ? "Lägg till Produkt"
      : "Göm formulär";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const productData = {
      namn: document.getElementById("name").value,
      beskrivning: document.getElementById("info").value,
      pris: parseFloat(document.getElementById("price").value),
      kategorier: document
        .getElementById("category")
        .value.split(",")
        .map((k) => k.trim()),
      mangd: document.getElementById("ammount").value,
      varumarke: document.getElementById("brand").value,
      innehallsforteckning: document.getElementById("content").value,
      jamforpris: `${document.getElementById("compare").value} kr/kg`,
      leverantor: document.getElementById("supplier").value,
      bild: document.getElementById("image").value,
    };
    const editId = sessionStorage.getItem("editProductId");

    try {
      if (editId) {
        // Edit mode

        await editData(productData, editId);
        sessionStorage.removeItem("editProductId");
      } else {
        // Add mode
        const url = "https://grupp-11-backend.vercel.app/api/products";
        const response = await axios.post(url, productData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        console.log("Produkt tillagd:", response.data);
      }

      loadProducts();
      form.reset();
      form.style.display = "none";
      toggleFormBtn.textContent = "Lägg till Produkt";
    } catch (error) {
      console.error("Misslyckades med att lägga till/redigera produkt:", error);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  printproductsAddEventlisteners();
});

async function loadProducts() {
  const container = document.getElementById("productContainer");
  container.innerHTML = "<p>Loading products...</p>";

  try {
    products = await fetchProducts();
    // products = productList;
    container.innerHTML = "";

    if (products.length > 0) {
      showProductsAdmin(products);

      document.querySelectorAll(".productCard").forEach((card) => {
        const editBtn = document.createElement("button");
        editBtn.innerText = "Redigera";
        editBtn.classList.add("editBtn");

        card.appendChild(editBtn);
      });
    } else {
      container.innerHTML = "<p>No products found.</p>";
    }
  } catch {
    console.error("Failed to load products:");
    container.innerHTML = "<p>Error loading products.</p>";
  }
}

//searchfunction searchbar
const searchBtn = document.querySelector("#searchBtnAdmin");
const searchbar = document.querySelector("#searchAdmin");

searchBtn.addEventListener("click", () =>
  searchProduct(searchbar.value, showProductsAdmin, products)
);
searchbar.addEventListener("input", () =>
  searchProduct(searchbar.value, showProductsAdmin, products)
);

//Function to make the searchfield active if clicked outside input-field

const searchfield = document.querySelector(".searchfield");

searchfield.addEventListener("click", () => {
  searchbar.focus();
});

//buttons header function

const productsBtn = document.querySelector("#productsBtn");
const ordersBtn = document.querySelector("#ordersBtn");
productsBtn.addEventListener("click", () => {
  printproductsAddEventlisteners();
  searchfield.style.visibility = "visible";
  ordersBtn.className = "notActive";
  productsBtn.className = "";
});
ordersBtn.addEventListener("click", () => {
  printOrdersAdminpage();
  searchfield.style.visibility = "hidden";
  ordersBtn.className = "";
  productsBtn.className = "notActive";
});
