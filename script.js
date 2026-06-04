const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const langButton = document.querySelector(".lang-switch");
let language = "fr";
const slides = [...document.querySelectorAll(".hero-slide")];
const slideButtons = [...document.querySelectorAll(".slider-controls button")];
const slideCaption = document.querySelector(".hero-caption");
const previousSlideButton = document.querySelector(".slider-prev");
const nextSlideButton = document.querySelector(".slider-next");
let currentSlide = 0;
let slideTimer;

const setHeaderState = () => header.classList.toggle("scrolled", window.scrollY > 30);
setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.classList.toggle("active", isOpen);
  menuButton.setAttribute("aria-expanded", isOpen);
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.classList.remove("active");
  menuButton.setAttribute("aria-expanded", "false");
}));

langButton.addEventListener("click", () => {
  language = language === "fr" ? "en" : "fr";
  document.documentElement.lang = language;
  document.querySelectorAll("[data-fr][data-en]").forEach((element) => {
    element.textContent = element.dataset[language];
  });
  langButton.innerHTML = language === "fr" ? "<strong>FR</strong><span>/</span> EN" : "FR <span>/</span><strong>EN</strong>";
});

const showSlide = (index) => {
  currentSlide = index;
  slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === index));
  slideButtons.forEach((button, buttonIndex) => button.classList.toggle("active", buttonIndex === index));
  if (slideCaption) slideCaption.textContent = slides[index].dataset.place;
};

const startSlider = () => {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide((currentSlide + 1) % slides.length), 4500);
};

slideButtons.forEach((button, index) => button.addEventListener("click", () => {
  showSlide(index);
  startSlider();
}));

previousSlideButton?.addEventListener("click", () => {
  showSlide((currentSlide - 1 + slides.length) % slides.length);
  startSlider();
});

nextSlideButton?.addEventListener("click", () => {
  showSlide((currentSlide + 1) % slides.length);
  startSlider();
});

if (slides.length) startSlider();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.animate(
        [
          { opacity: 0, transform: "translateY(55px)", clipPath: "inset(0 0 20% 0)" },
          { opacity: 1, transform: "translateY(0)", clipPath: "inset(0 0 0 0)" }
        ],
        { duration: 950, delay: Number(entry.target.dataset.delay || 0), easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }
      );
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".section-heading, .intro > *, .service, .steps li, .values-copy, .values-list article, .contact > *").forEach((item, index) => {
  item.dataset.delay = (index % 3) * 90;
  observer.observe(item);
});

window.addEventListener("scroll", () => {
  const visual = document.querySelector(".hero-slide.active img");
  if (visual && window.scrollY < window.innerHeight) {
    visual.style.transform = `translateY(${window.scrollY * 0.05}px) scale(1.04)`;
  }
}, { passive: true });
