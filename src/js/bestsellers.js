import Swiper from "swiper/bundle";
import { fetchFavorites, fetchBouquetById } from "./api.js";
import { notify } from "./notify.js";
import { showProductModal, showUnavailableModal, openModal } from "./modal.js";

const STATIC_SLIDES = [
  {
    photoURL: "https://ftp.goit.study/img/flowers/68498236a1003120869.png",
    title: "Spring Elegance",
    description:
      "A delicate blend of peonies, tulips, and roses — perfect for springtime gifting and bright smiles.",
    price: 35,
    isFallback: true,
  },
  {
    photoURL: "https://ftp.goit.study/img/flowers/68498236a1003120870.png",
    title: "Berry Chic",
    description:
      "A stylish composition of roses, seasonal greenery, and vibrant berries — a bold and elegant floral statement.",
    price: 40,
    isFallback: true,
  },
  {
    photoURL: "https://ftp.goit.study/img/flowers/68498236a1003120871.png",
    title: "Lavender Dream",
    description:
      "A rich bouquet with lavender, lisianthus, and roses — ideal for those who love deep hues and gentle fragrance.",
    price: 55,
    isFallback: true,
  },
  {
    photoURL: "https://ftp.goit.study/img/flowers/68498236a1003120872.png",
    title: "Lavendin Hell",
    description:
      "A dramatic arrangement of dark purple roses, calla lilies, and lush greenery — designed for bold personalities and unforgettable moments.",
    price: 75,
    isFallback: true,
  },
];

function prepareSlides(favs) {
  if (favs.length >= 4) return favs.map((f) => ({ ...f, isFallback: false }));
  const need = 4 - favs.length;
  return [
    ...favs.map((f) => ({ ...f, isFallback: false })),
    ...STATIC_SLIDES.slice(0, need),
  ];
}

export async function initBestsellers() {
  let favs = [];
  try {
    favs = await fetchFavorites();
  } catch {}

  const slides = prepareSlides(favs);

  const swiperWrapper = document.querySelector(".slides-swiper .swiper-wrapper");
  swiperWrapper.innerHTML = slides
    .map(
      (slide, idx) => `
      <li class="swiper-slide slide-card" data-idx="${idx}">
        <img src="${slide.photoURL}" alt="${slide.title}" class="slide-img" />
        <div class="slide-text">
          <h3 class="slide-name">${slide.title}</h3>
          <p class="slide-desc">${slide.description}</p>
          <p class="slide-price">$${slide.price}</p>
        </div>
      </li>`,
    )
    .join("");

  swiperWrapper.addEventListener("click", (e) => {
    const item = e.target.closest(".slide-card");
    if (!item) return;

    const slide = slides[parseInt(item.dataset.idx, 10)];
    if (!slide) return;

    if (slide.isFallback) {
      showUnavailableModal(slide);
      openModal();
      notify.warning(`"${slide.title}" наразі недоступно у нашому магазині.`);
      return;
    }

    fetchBouquetById(slide.id)
      .then((data) => {
        showProductModal(data);
        openModal();
      })
      .catch((err) => {
        console.error("Помилка:", err);
        notify.error("Не вдалося завантажити деталі букету. Спробуйте ще раз.");
      });
  });

  new Swiper(".slides-swiper", {
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
    pagination: { el: ".slides-dots", clickable: true },
    navigation: { nextEl: "#slides-btn-next", prevEl: "#slides-btn-prev" },
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 0 },
      768: { slidesPerView: 2, spaceBetween: 24 },
      1440: { slidesPerView: 3, spaceBetween: 32 },
    },
  });
}
