import { fetchBouquetsPage } from "./api.js";
import { notify } from "./notify.js";
import { openProductModal } from "./modal.js";

const catalogList = document.getElementById("catalog-list");
const catalogEmpty = document.getElementById("catalog-empty");
const catalogError = document.getElementById("catalog-error");
const loadMoreBtn = document.getElementById("load-more-btn");

const BATCH = 8;
let currentPage = 1;
let loadedItems = [];

function buildCard(item) {
  return `
    <li class="catalog-card" data-id="${item.id}">
      <img src="${item.photoURL}" alt="${item.title}" class="card-img flower" fetchpriority="high" />
      <div class="card-info">
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.description}</p>
        <p class="card-price">$${item.price}</p>
      </div>
    </li>`;
}

function renderCatalog() {
  catalogList.innerHTML = loadedItems.map(buildCard).join("");
  catalogEmpty.classList.toggle("hidden-el", loadedItems.length > 0);
  loadMoreBtn.style.display = "none";
  catalogError.classList.add("hidden-el");
}

async function loadCatalog() {
  try {
    catalogError.classList.add("hidden-el");
    const isFirst = currentPage === 1;
    const items = await fetchBouquetsPage(currentPage, BATCH);
    loadedItems = [...loadedItems, ...items];
    renderCatalog();
    currentPage++;

    if (!isFirst) {
      const firstCard = catalogList.querySelector(".catalog-card");
      if (firstCard) {
        window.scrollBy({
          top: firstCard.getBoundingClientRect().height,
          behavior: "smooth",
        });
      }
    }

    if (items.length < BATCH) {
      loadMoreBtn.textContent = "All loaded";
      loadMoreBtn.disabled = true;
    } else {
      loadMoreBtn.style.display = "block";
    }
  } catch (err) {
    console.error("Loading error:", err);
    catalogError.textContent = "Server is starting, try again in 30 seconds...";
    catalogError.classList.remove("hidden-el");
  }
}

export function initCatalog() {
  loadMoreBtn.addEventListener("click", loadCatalog);

  catalogList.addEventListener("click", async (e) => {
    const card = e.target.closest(".catalog-card");
    if (!card) return;
    await openProductModal(card.dataset.id);
  });

  loadCatalog();
}
