const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const form = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");
const yearSpan = document.querySelector("#year");
const hero = document.querySelector(".hero");
const heroVideo = document.querySelector(".hero-video");
const teamCards = document.querySelectorAll(".team-card");
const slider = document.querySelector("[data-slider]");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const showHeroPoster = () => {
  hero?.classList.add("hero--poster");
};

if (heroVideo) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    showHeroPoster();
    heroVideo.pause();
  } else {
    const attempt = heroVideo.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => {
        showHeroPoster();
      });
    }

    heroVideo.addEventListener("ended", () => {
      heroVideo.currentTime = 0;
      heroVideo.play();
    });
  }

  heroVideo.addEventListener("error", showHeroPoster);
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const message = document.querySelector("#message").value.trim();

  if (!name || !email || !message) {
    feedback.textContent = "Merci de remplir tous les champs.";
    return;
  }

  if (!emailPattern.test(email)) {
    feedback.textContent = "Merci de renseigner un email valide.";
    return;
  }

  feedback.textContent = "Message pret a etre envoye.";
});

const revealElements = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
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

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("is-visible"));
}
