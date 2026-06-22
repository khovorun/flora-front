import { fetchBouquetById, postOrder } from "./api.js";
import { notify } from "./notify.js";

const modalOverlay = document.getElementById("modal-overlay");
const modalInner = document.getElementById("modal-inner");
const dismissBtn = document.getElementById("modal-dismiss-btn");

let activeQty = 1;

export function openModal() {
  modalOverlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

export function closeModal() {
  modalOverlay.classList.remove("is-open");
  document.body.style.overflow = "visible";
  modalInner.innerHTML = "";
  modalInner.classList.remove("view-mode", "form-mode");
  dismissBtn._backHandler = null;
  activeQty = 1;
}

modalOverlay.addEventListener("click", (e) => {
  if (e.target !== modalOverlay) return;
  if (dismissBtn._backHandler) {
    dismissBtn._backHandler();
    dismissBtn._backHandler = null;
    return;
  }
  closeModal();
});

dismissBtn.addEventListener("click", () => {
  if (dismissBtn._backHandler) {
    dismissBtn._backHandler();
    dismissBtn._backHandler = null;
    return;
  }
  closeModal();
});

export function showProductModal(data) {
  modalInner.classList.remove("form-mode");
  modalInner.classList.add("view-mode");

  modalInner.innerHTML = `
    <img src="${data.photoURL}" alt="${data.title}" class="product-photo" fetchpriority="high" />
    <div class="product-details">
      <h3 class="product-name">${data.title}</h3>
      <p class="product-price">$${data.price}</p>
      <p class="product-desc">${data.description}</p>
      <div class="buy-row">
        <button class="btn gradient-btn purchase-btn" aria-label="add to cart" type="button">Buy now</button>
        <input type="number" class="qty-field" value="1" min="1" max="9999" />
      </div>
    </div>
  `;

  const purchaseBtn = modalInner.querySelector(".purchase-btn");
  const qtyField = modalInner.querySelector(".qty-field");

  purchaseBtn.addEventListener("click", () => {
    activeQty = parseInt(qtyField.value, 10) || 1;
    showOrderForm(data);
  });
}

export function showUnavailableModal(slideData) {
  modalInner.classList.remove("form-mode");
  modalInner.classList.add("view-mode");

  modalInner.innerHTML = `
    <img src="${slideData.photoURL}" alt="${slideData.title}" class="product-photo" fetchpriority="high" />
    <div class="product-details">
      <h3 class="product-name">${slideData.title}</h3>
      <p class="product-price">$${slideData.price}</p>
      <p class="product-desc">${slideData.description}</p>
      <div class="buy-row" style="justify-content:center;">
        <p style="font-weight:600;color:#ef4444;font-size:15px;">⚠️ Currently unavailable</p>
      </div>
    </div>
  `;
}

export async function openProductModal(id) {
  dismissBtn._backHandler = null;
  try {
    const data = await fetchBouquetById(id);
    activeQty = 1;
    showProductModal(data);
    openModal();
  } catch (err) {
    console.error("Loading error:", err);
    notify.error("Failed to load bouquet details. Please try again.");
  }
}

function checkPhone(val) {
  return /^[+]?[0-9\s()\-]{7,18}$/.test(val.trim());
}

function showOrderForm(data) {
  modalInner.classList.remove("view-mode");
  modalInner.classList.add("form-mode");

  modalInner.innerHTML = `
    <h2 class="form-heading">Order</h2>
    <form class="order-form" id="order-form" novalidate>
      <div class="form-field">
        <label class="field-label" for="order-name">Name*</label>
        <input class="field-input" id="order-name" type="text" name="name" placeholder="Anna" required />
        <span class="field-err hidden-el" id="order-name-err"></span>
      </div>
      <div class="form-field">
        <label class="field-label" for="order-phone">Phone*</label>
        <input class="field-input" id="order-phone" type="tel" name="phone" placeholder="+380 (50) 123-4567" required />
        <span class="field-err hidden-el" id="order-phone-err"></span>
      </div>
      <div class="form-field">
        <label class="field-label" for="order-address">Address*</label>
        <input class="field-input" id="order-address" type="text" name="address" placeholder="12 Flower St, Kyiv" required />
        <span class="field-err hidden-el" id="order-address-err"></span>
      </div>
      <div class="form-field">
        <label class="field-label" for="order-comment">Comment</label>
        <textarea class="field-input" id="order-comment" name="comment" placeholder="Your message..."></textarea>
      </div>
      <button class="btn gradient-btn submit-btn" type="submit">Go to Checkout</button>
    </form>
  `;

  const form = modalInner.querySelector("#order-form");

  function markError(fieldId, msg) {
    const inp = form.querySelector(`#${fieldId}`);
    const err = form.querySelector(`#${fieldId}-err`);
    if (!inp || !err) return;
    inp.classList.add("has-error");
    err.textContent = msg;
    err.classList.remove("hidden-el");
  }

  function clearError(fieldId) {
    const inp = form.querySelector(`#${fieldId}`);
    const err = form.querySelector(`#${fieldId}-err`);
    if (!inp || !err) return;
    inp.classList.remove("has-error");
    err.textContent = "";
    err.classList.add("hidden-el");
  }

  form.querySelectorAll(".field-input").forEach((inp) => {
    inp.addEventListener("focus", () => {
      inp.closest(".form-field")?.querySelector(".field-label")?.classList.add("focused");
    });
    inp.addEventListener("blur", () => {
      inp.closest(".form-field")?.querySelector(".field-label")?.classList.remove("focused");
    });
  });

  ["order-name", "order-phone", "order-address"].forEach((id) => {
    form.querySelector(`#${id}`)?.addEventListener("input", () => clearError(id));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = fd.get("name").trim();
    const phone = fd.get("phone").trim();
    const address = fd.get("address").trim();
    let hasErr = false;

    if (!name) { markError("order-name", "Please enter your name"); hasErr = true; }
    if (!phone) {
      markError("order-phone", "Please enter your phone number"); hasErr = true;
    } else if (!checkPhone(phone)) {
      markError("order-phone", "Invalid phone number format"); hasErr = true;
    }
    if (!address) { markError("order-address", "Please enter your address"); hasErr = true; }

    if (hasErr) {
      notify.error("Please fix the errors in the form before submitting.");
      return;
    }

    const payload = {
      bouquet: { id: data.id, title: data.title, price: data.price },
      quantity: activeQty,
      total: `$${(data.price * activeQty).toFixed(2)}`,
      customer: { name, phone, address, comment: fd.get("comment") || "" },
    };

    const submitBtn = form.querySelector(".submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Оформлення...";

    try {
      await postOrder(payload);
      closeModal();
      notify.success(`Order "${data.title}" has been placed! We will contact you shortly.`);
    } catch (err) {
      console.error("Order error:", err);
      submitBtn.disabled = false;
      submitBtn.textContent = "Place Order";
      notify.error("Failed to place order. Please try again.");
    }
  });

  dismissBtn._backHandler = () => showProductModal(data);
}
