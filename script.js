import { PROJECTS } from "./projects.js";

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const yearSpan = document.querySelector("#year");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const teamCards = document.querySelectorAll(".team-card");
const heroMedia = document.querySelector(".hero-media");
const heroSection = document.querySelector(".hero");
const heroVideo = document.querySelector(".hero-video");
const posterWall = document.querySelector(".poster-wall");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

document.body.classList.add("is-loaded");

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

const updateLogoVisibility = () => {
  const scrollTop = window.scrollY;
  const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = scrollTop / scrollRange;
  let visibility = 0;

  if (progress <= 0.1) {
    visibility = 0;
  } else if (progress >= 0.15) {
    visibility = 1;
  } else {
    visibility = (progress - 0.1) / 0.05;
  }

  document.body.style.setProperty("--logo-visibility", visibility.toFixed(3));
};

updateLogoVisibility();
window.addEventListener("scroll", updateLogoVisibility, { passive: true });
window.addEventListener("resize", updateLogoVisibility);

if (heroMedia && heroSection) {
  let ticking = false;

  const setHeroProgress = (value) => {
    document.body.style.setProperty("--hero-bg-progress", value.toFixed(3));
  };

  const updateHeroVideoState = () => {
    const threshold = Math.max(window.innerHeight * 0.6, 1);
    const progress = Math.min(window.scrollY / threshold, 1);
    setHeroProgress(progress);
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeroVideoState);
      ticking = true;
    }
  };

  updateHeroVideoState();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateHeroVideoState);
}

const loadHeroVideo = (forceReload = false) => {
  if (!heroVideo) {
    return;
  }

  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  const src = isMobile ? heroVideo.dataset.srcMobile : heroVideo.dataset.src;

  if (!src) {
    return;
  }

  if (!forceReload && heroVideo.dataset.loaded === "true") {
    return;
  }

  heroVideo.querySelectorAll("source").forEach((source) => source.remove());

  const source = document.createElement("source");
  source.src = src;
  source.type = "video/mp4";
  heroVideo.appendChild(source);
  heroVideo.dataset.loaded = "true";
  heroVideo.dataset.currentSrc = src;
  heroVideo.load();

  const playPromise = heroVideo.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {});
  }
};

if (heroSection && heroVideo) {
  if (prefersReducedMotion) {
    loadHeroVideo();
  } else if ("IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadHeroVideo();
            heroObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    heroObserver.observe(heroSection);
  } else {
    loadHeroVideo();
  }
}

const refreshHeroVideoForViewport = () => {
  if (!heroVideo || heroVideo.dataset.loaded !== "true") {
    return;
  }
  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  const expected = isMobile ? heroVideo.dataset.srcMobile : heroVideo.dataset.src;
  if (expected && heroVideo.dataset.currentSrc !== expected) {
    loadHeroVideo(true);
  }
};

window.addEventListener("resize", refreshHeroVideoForViewport);

const revealElements = new Set();
const revealSelectors = [
  "main .section:not(.hero) h2",
  ".concept-body p",
  ".contact-email",
  ".end-hero-text"
];

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

if (posterWall && Array.isArray(PROJECTS)) {
  const fragment = document.createDocumentFragment();

  PROJECTS.forEach((project) => {
    if (project.showOnWall === false) {
      return;
    }
    const hasHorizontal = Boolean(project.posterH);

    if (!hasHorizontal) {
      return;
    }

    const wrapper = document.createElement(project.url ? "a" : "div");

    wrapper.className = "poster poster--h";

    if (project.url) {
      wrapper.href = project.url;
      wrapper.target = "_blank";
      wrapper.rel = "noopener";
    } else {
      wrapper.tabIndex = 0;
    }

    const media = document.createElement("div");
    media.className = "poster-media";

    const img = document.createElement("img");
    img.src = project.posterH;
    img.alt = project.title ? `Affiche ${project.title}` : "Affiche de production";
    img.loading = "lazy";
    img.decoding = "async";

    media.appendChild(img);
    wrapper.appendChild(media);

    if (project.type || project.duration) {
      const meta = document.createElement("div");
      meta.className = "poster-meta";

      if (project.type) {
        const type = document.createElement("span");
        type.className = "poster-meta-type";
        type.textContent = project.type;
        meta.appendChild(type);
      }

      if (project.duration) {
        const duration = document.createElement("span");
        duration.className = "poster-meta-duration";
        duration.textContent = project.duration;
        meta.appendChild(duration);
      }

      wrapper.appendChild(meta);
    }

    fragment.appendChild(wrapper);
  });

  posterWall.appendChild(fragment);
}

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

const END_HERO_OFFSET = 120;

const updateEndHeroState = () => {
  const scrollBottom = window.scrollY + window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;
  const isNearBottom = scrollBottom >= pageHeight - END_HERO_OFFSET;
  document.body.classList.toggle("is-end-hero-active", isNearBottom);
};

updateEndHeroState();
window.addEventListener("scroll", updateEndHeroState, { passive: true });
window.addEventListener("resize", updateEndHeroState);
