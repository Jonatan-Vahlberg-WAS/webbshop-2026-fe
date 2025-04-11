import { printOrder } from "./printOrder.js";
import { sendOrder } from "./sendOrder.js";
import { reloadCart } from "./createProductCard.js";

export function printOrderForm() {
  document.querySelector("#cartDiv").style.display = "none";

  const container = document.querySelector("body");
  const formArea = document.createElement("div");
  formArea.id = "formArea";
  formArea.addEventListener("click", (e) => {
    const clickedOutsidePopup = e.target === formArea;

    if (clickedOutsidePopup && container.contains(formArea)) {
      container.removeChild(formArea);
      document.body.style.overflow = "";
      reloadCart();
    }
  });
  const order = printOrder();

  if (!order) {
    return;
  }
  document.body.style.overflow = "hidden";
  const formContainer = document.createElement("div");
  formContainer.id = "formContainer";
  const form = document.createElement("form");
  form.classList.add("userForm");
  form.addEventListener("submit", async (e) => {
    form.querySelectorAll("input, textarea").forEach((el) => {
      el.value = el.value.trim();
    });

    const res = await sendOrder(e, form);
    if (res) {
      document.querySelector(".productsOrderCont").remove();
      document.querySelector(".sendFormBtn").remove();
      const orderSuccessDiv = document.createElement("div");
      orderSuccessDiv.classList.add("orderSuccessDiv");
      sessionStorage.removeItem("cart");

      const thanksTitle = document.createElement("h2");
      thanksTitle.innerText = "Tack för din beställning!";

      document.querySelector(".background").classList.add("red");
      const payment = document.createElement("p");
      payment.innerHTML = `Glöm inte att Swisha <span class="bold">${res.totalSum.toFixed(
        2
      )} kr</span> till <span class="italic">+46 70 123 45 67</span> för att slutföra din beställning.`;
      payment.classList.add("payment");
      const deliver = document.createElement("p");
      deliver.innerHTML = `Din beställning levereras till <span class="italic">${res.address}</span> inom 7 arbetsdagar efter att betalning bekräftats.`;
      deliver.classList.add("deliver");

      orderSuccessDiv.append(thanksTitle, payment, deliver);
      document.querySelector(".background").append(orderSuccessDiv);
    }
  });
  const background = document.createElement("div");
  background.classList.add("background");
  const productsOrderCont = document.createElement("div");
  productsOrderCont.classList.add("productsOrderCont");

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("closeBtn");
  closeBtn.innerText = "X";
  closeBtn.addEventListener("click", () => {
    if (container.contains(formArea)) {
      document.body.style.overflow = "";
      reloadCart();
      container.removeChild(formArea);
    }
  });

  const obligatoriskt = document.createElement("p");
  obligatoriskt.classList.add("obligatoriskt");
  obligatoriskt.innerText = "Fält markerade med * är obligatoriska.";

  const deliveryTitle = document.createElement("h2");
  deliveryTitle.classList.add("deliveryTitle");
  deliveryTitle.innerText = "LEVERANS";

  const sendFormBtn = document.createElement("button");
  sendFormBtn.classList.add("sendFormBtn");
  sendFormBtn.innerText = "Skicka beställning!";
  sendFormBtn.addEventListener("click", () => {
    form.requestSubmit();
  });

  productsOrderCont.append(order, formContainer);
  background.append(closeBtn, productsOrderCont, sendFormBtn);

  formArea.append(background);
  const fields1 = [
    {
      label: "Förnamn*",
      className: "namn",
      placeholder: "Fyll i förnamn",
    },
    {
      label: "Efternamn*",
      className: "efternamn",
      placeholder: "Fyll i efternamn",
    },
    {
      label: "Mailadress*",
      className: "email",
      placeholder: "Fyll i mailadress",
    },
    {
      label: "Telefonnummer*",
      className: "tele",
      placeholder: "Fyll i telefonnummer",
    },
  ];
  const fields2 = [
    { label: "Hemadress*", className: "address", placeholder: "Fyll i adress" },
    { label: "Ort*", className: "stad", placeholder: "Fyll i ort" },
    {
      label: "Postnummer*",
      className: "postnummer",
      placeholder: "Fyll i postnummer",
    },
  ];
  const formGroupsCont1 = document.createElement("div");
  formGroupsCont1.classList.add("formGroupsCont1");
  const formGroupsCont2 = document.createElement("div");
  formGroupsCont2.classList.add("formGroupsCont2");

  fields1.forEach(({ label, className, placeholder }) => {
    const div = document.createElement("div");
    div.classList.add("formGroup");

    const lbl = document.createElement("label");
    lbl.textContent = label;
    lbl.setAttribute("for", className);

    const input = document.createElement("input");
    input.placeholder = placeholder;
    input.maxLength = 40;

    if (label === "Telefonnummer*") {
      input.type = "tel";
      input.pattern = "[0-9+\\s\\-]+";
      input.title =
        "Endast siffror, plustecken, bindestreck och mellanslag tillåtna";
    } else if (label === "Mailadress*") {
      input.type = "email";
      input.pattern = "[^@\\s]+@[^@\\s]+\\.[^@\\s]+";
      input.title = "Ange en giltig e-postadress";
    } else {
      input.type = "text";
      if (label === "Förnamn*" || label === "Efternamn*") {
        input.pattern = "[A-Za-zÅÄÖåäö\\s]+";
        input.title = "Endast bokstäver och mellanslag tillåtna";
      } else {
        input.title = "Fältet får inte vara tomt";
      }
    }

    input.className = className;
    input.id = className;
    input.name = className;
    input.required = true;

    div.appendChild(lbl);
    div.appendChild(input);
    formGroupsCont1.appendChild(div);
  });

  fields2.forEach(({ label, className, placeholder }) => {
    const div = document.createElement("div");
    div.classList.add("formGroup");

    const lbl = document.createElement("label");
    lbl.textContent = label;
    lbl.setAttribute("for", className);

    const input = document.createElement("input");
    input.placeholder = placeholder;
    input.maxLength = 40;

    if (label === "Postnummer*") {
      input.type = "text";
      input.pattern = "[0-9\\s]+";
      input.title = "Endast siffror och mellanslag tillåtna";
    } else {
      input.type = "text";
      if (label === "Förnamn*" || label === "Efternamn*") {
        input.pattern = "[A-Za-zÅÄÖåäö\\s]+";
        input.title = "Endast bokstäver och mellanslag tillåtna";
      } else {
        input.title = "Fältet får inte vara tomt";
      }
    }

    input.className = className;
    input.id = className;
    input.name = className;
    input.required = true;

    div.appendChild(lbl);
    div.appendChild(input);
    formGroupsCont2.append(div);
  });
  form.append(formGroupsCont1, formGroupsCont2);

  const formGroupInfoField = document.createElement("div");
  formGroupInfoField.classList.add("formGroup");

  const infoField = document.createElement("textarea");
  infoField.classList.add("infoField");
  infoField.id = "info";
  infoField.name = "info";
  infoField.placeholder = "Lägg till en anteckning";
  infoField.maxLength = 80;

  const charCount = document.createElement("div");
  charCount.id = "charCount";
  charCount.textContent = "0 / 100";

  const lblFormGroup = document.createElement("label");
  lblFormGroup.textContent = "Särskilda instruktioner";
  lblFormGroup.setAttribute("for", "info");

  infoField.addEventListener("input", () => {
    charCount.textContent = `${infoField.value.length} / ${infoField.maxLength}`;
  });

  formGroupInfoField.append(lblFormGroup, infoField, charCount);
  formGroupsCont2.append(formGroupInfoField);

  formContainer.append(deliveryTitle, obligatoriskt, form);
  container.append(formArea);
}
