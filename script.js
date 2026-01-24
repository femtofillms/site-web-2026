const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const yearSpan = document.querySelector("#year");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const teamCards = document.querySelectorAll(".team-card");
const slider = document.querySelector("[data-slider]");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const closeNav = () => {
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

navToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    closeNav();
  }
});

const clearTeamActives = () => {
  teamCards.forEach((card) => card.classList.remove("is-active"));
};

teamCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    event.stopPropagation();
    const isActive = card.classList.toggle("is-active");
    if (isActive) {
      teamCards.forEach((other) => {
        if (other !== card) {
          other.classList.remove("is-active");
        }
      });
    }
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.classList.toggle("is-active");
    }
  });
});

document.addEventListener("click", () => {
  clearTeamActives();
});

if (slider) {
  slider.setAttribute("tabindex", "0");
}

const revealElements = new Set();
const revealSelectors = ["main .section:not(.hero) h2", ".concept-body p", ".contact-email"];

revealSelectors.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.classList.add("reveal");
    revealElements.add(el);
  });
});

teamCards.forEach((card, index) => {
  card.classList.add("reveal");
  card.style.transitionDelay = `${index * 60}ms`;
  revealElements.add(card);
});

document.querySelectorAll(".project-card").forEach((card, index) => {
  card.classList.add("reveal");
  card.style.transitionDelay = `${index * 60}ms`;
  revealElements.add(card);
});

const revealList = Array.from(revealElements);

if (prefersReducedMotion) {
  revealList.forEach((el) => el.classList.add("is-visible"));
} else if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealList.forEach((el) => observer.observe(el));
} else {
  revealList.forEach((el) => el.classList.add("is-visible"));
}
