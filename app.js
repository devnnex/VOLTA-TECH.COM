const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroVideo = document.querySelector(".hero-video");

if (prefersReducedMotion && heroVideo) {
  heroVideo.removeAttribute("autoplay");
  heroVideo.pause();
}

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navPanel = document.querySelector("[data-nav-panel]");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const closeMenu = () => {
  menuToggle?.setAttribute("aria-expanded", "false");
  navPanel?.classList.remove("is-open");
  header?.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navPanel?.classList.toggle("is-open", !isOpen);
  header?.classList.toggle("menu-active", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navPanel?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const animateCounter = (counter) => {
  if (counter.dataset.done === "true") return;

  counter.dataset.done = "true";
  const target = Number(counter.dataset.target ?? 0);
  const prefix = counter.dataset.prefix ?? "";
  const suffix = counter.dataset.suffix ?? "";
  const duration = prefersReducedMotion ? 1 : 1500;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    counter.textContent = `${prefix}${current}${suffix}`;

    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
);

revealItems.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.45 },
);

counters.forEach((counter) => counterObserver.observe(counter));

const filters = document.querySelectorAll("[data-filter]");
const projects = document.querySelectorAll("[data-category]");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const selected = filter.dataset.filter;

    filters.forEach((item) => item.classList.toggle("active", item === filter));
    projects.forEach((project) => {
      const shouldShow = selected === "all" || project.dataset.category === selected;
      project.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const slides = document.querySelectorAll(".testimonial");
const prevButton = document.querySelector("[data-prev]");
const nextButton = document.querySelector("[data-next]");
let currentSlide = 0;
let sliderTimer;

const showSlide = (index) => {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentSlide);
  });
};

const startSlider = () => {
  if (prefersReducedMotion || slides.length < 2) return;
  sliderTimer = window.setInterval(() => showSlide(currentSlide + 1), 6000);
};

const restartSlider = () => {
  window.clearInterval(sliderTimer);
  startSlider();
};

prevButton?.addEventListener("click", () => {
  showSlide(currentSlide - 1);
  restartSlider();
});

nextButton?.addEventListener("click", () => {
  showSlide(currentSlide + 1);
  restartSlider();
});

startSlider();

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-item").forEach((sibling) => {
      if (sibling !== item) sibling.open = false;
    });
  });
});

const cursorGlow = document.querySelector(".cursor-glow");

if (cursorGlow && !prefersReducedMotion) {
  window.addEventListener(
    "pointermove",
    (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    },
    { passive: true },
  );
}

const parallaxItems = document.querySelectorAll("[data-parallax]");

if (!prefersReducedMotion && parallaxItems.length) {
  window.addEventListener(
    "scroll",
    () => {
      const offset = window.scrollY * 0.035;
      parallaxItems.forEach((item) => {
        item.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    },
    { passive: true },
  );
}

const form = document.querySelector(".contact-form");
const formNote = document.querySelector("[data-form-note]");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") ?? "").trim();
  const company = String(data.get("company") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const phone = String(data.get("phone") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();

  const text = [
    `Hola VOLTATECH, soy ${name}.`,
    company ? `Empresa: ${company}.` : "",
    email ? `Correo: ${email}.` : "",
    phone ? `Telefono: ${phone}.` : "",
    message ? `Mensaje: ${message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappUrl = `https://wa.me/573126319064?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  if (formNote) {
    formNote.textContent = "Abrimos WhatsApp con tu mensaje listo para enviar.";
  }
});
