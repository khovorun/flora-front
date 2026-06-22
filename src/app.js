import "./css/style.css";
import "swiper/css/bundle";

import { keepAlive } from "./js/api.js";
import { initBurger } from "./js/burger.js";
import { initScrollTop } from "./js/scrollTop.js";
import { initCatalog } from "./js/catalog.js";
import { initBestsellers } from "./js/bestsellers.js";
import { initReviews } from "./js/reviews.js";

window.history.scrollRestoration = "manual";
window.scrollTo({ top: 0, behavior: "instant" });

setInterval(keepAlive, 10 * 60 * 1000);

initBurger();
initScrollTop();
initCatalog();
initBestsellers();
initReviews();
