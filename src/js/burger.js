const drawerOverlay = document.querySelector(".drawer-overlay");
const burgerOpenBtn = document.querySelector(".burger-open-btn");
const burgerCloseBtn = document.querySelector(".burger-close-btn");
const drawerLinks = document.querySelectorAll(".drawer-link");
const navCtaBtns = document.querySelectorAll(".nav-cta");

function closeDrawer() {
  drawerOverlay.classList.remove("open");
  burgerCloseBtn.classList.remove("active");
  burgerOpenBtn.classList.remove("hidden-el");
  document.body.style.overflow = "visible";
}

function openDrawer() {
  drawerOverlay.classList.add("open");
  burgerCloseBtn.classList.add("active");
  burgerOpenBtn.classList.add("hidden-el");
  document.body.style.overflow = "hidden";
}

export function initBurger() {
  navCtaBtns.forEach((btn) => btn.addEventListener("click", closeDrawer));
  drawerLinks.forEach((link) => link.addEventListener("click", closeDrawer));
  burgerCloseBtn.addEventListener("click", closeDrawer);
  burgerOpenBtn.addEventListener("click", openDrawer);

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1440) closeDrawer();
  });
}
