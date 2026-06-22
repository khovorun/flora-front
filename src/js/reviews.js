import Swiper from "swiper/bundle";
import { fetchReviews } from "./api.js";

const STATIC_REVIEWS = [
  {
    text: '"Flora made my anniversary unforgettable with their beautiful arrangement!"',
    author: "Emma T.",
  },
  {
    text: "Absolutely stunning bouquet! It looked even better than the photo and arrived right on time.",
    author: "Daniel R.",
  },
  {
    text: "The service was exceptional, and the flowers were fresh for over two weeks!",
    author: "Olivia M.",
  },
  {
    text: "I ordered a last-minute birthday bouquet and was amazed — it was delivered within hours and looked gorgeous.",
    author: "Sophie K.",
  },
  {
    text: "Every time I order from Flora, I know I'm getting something truly special. My go-to flower shop!",
    author: "James L.",
  },
  {
    text: "The team helped me choose the perfect arrangement for my mom's birthday. She was in tears — the good kind!",
    author: "Lena B.",
  },
];

export async function initReviews() {
  let reviews = [];

  try {
    const data = await fetchReviews();
    if (Array.isArray(data) && data.length > 0) reviews = data;
  } catch {}

  if (reviews.length === 0) reviews = STATIC_REVIEWS;

  const wrapper = document.querySelector(".feedback-swiper .swiper-wrapper");
  wrapper.innerHTML = reviews
    .map(
      (r) => `
      <li class="swiper-slide review-card">
        <p class="review-text">${r.text}</p>
        <p class="review-author">${r.author}</p>
      </li>`,
    )
    .join("");

  new Swiper(".feedback-swiper", {
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
    navigation: {
      nextEl: ".feedback-swiper .swiper-button-next",
      prevEl: ".feedback-swiper .swiper-button-prev",
    },
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 0 },
      768: { slidesPerView: 2, spaceBetween: 24 },
      1440: { slidesPerView: 3, spaceBetween: 32 },
    },
  });
}
