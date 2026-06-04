const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const langButton = document.querySelector(".lang-switch");
let language = "fr";

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

document.querySelectorAll(".section-heading, .intro > *, .services-grid, .steps li, .news-cover, .news-content, .values-copy, .values-list article, .contact > *").forEach((item, index) => {
  item.dataset.delay = (index % 3) * 90;
  observer.observe(item);
});

document.querySelectorAll(".value-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * -14;
    const y = ((event.clientY - rect.top) / rect.height - .5) * -14;
    card.style.setProperty("--move-x", `${x}px`);
    card.style.setProperty("--move-y", `${y}px`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--move-x", "0px");
    card.style.setProperty("--move-y", "0px");
  });
});

const serviceCards = [...document.querySelectorAll(".service")];
let activeService = 0;
let serviceTimer;

const activateService = (index) => {
  activeService = index;
  serviceCards.forEach((card, cardIndex) => card.classList.toggle("active", cardIndex === index));
};

const startServiceCycle = () => {
  clearInterval(serviceTimer);
  serviceTimer = setInterval(() => activateService((activeService + 1) % serviceCards.length), 3200);
};

serviceCards.forEach((card, index) => {
  card.addEventListener("pointerenter", () => {
    activateService(index);
    clearInterval(serviceTimer);
  });
  card.addEventListener("pointerleave", startServiceCycle);
});

if (serviceCards.length) startServiceCycle();

const counters = [...document.querySelectorAll(".counter")];
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.target);
    const prefix = counter.dataset.prefix || "";
    const suffix = counter.dataset.suffix || "";
    const duration = 1700;
    const start = performance.now();

    const updateCounter = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      counter.textContent = `${prefix}${Math.floor(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(updateCounter);
    };

    requestAnimationFrame(updateCounter);
    counterObserver.unobserve(counter);
  });
}, { threshold: .65 });

counters.forEach((counter) => counterObserver.observe(counter));

window.addEventListener("scroll", () => {
  const visual = document.querySelector(".hero-slide-track");
  if (visual && window.scrollY < window.innerHeight) visual.style.marginTop = `${window.scrollY * 0.025}px`;
}, { passive: true });
