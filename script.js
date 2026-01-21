const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const form = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");
const actions = document.querySelector("#form-actions");
const copyBtn = document.querySelector("#copy-message");
const mailtoLink = document.querySelector("#mailto-link");
const yearSpan = document.querySelector("#year");

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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildMessage = (name, email, message) => {
  return `Nom: ${name}\nEmail: ${email}\n\n${message}`;
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const message = document.querySelector("#message").value.trim();

  if (!name || !email || !message) {
    feedback.textContent = "Merci de remplir tous les champs.";
    actions.hidden = true;
    return;
  }

  if (!emailPattern.test(email)) {
    feedback.textContent = "Merci de renseigner un email valide.";
    actions.hidden = true;
    return;
  }

  const fullMessage = buildMessage(name, email, message);
  feedback.textContent = "Message pret a etre envoye.";
  actions.hidden = false;

  const subject = encodeURIComponent("Contact Femto Films");
  const body = encodeURIComponent(fullMessage);
  mailtoLink.href = `mailto:contact@femtofilms.fr?subject=${subject}&body=${body}`;

  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      feedback.textContent = "Message copie.";
    } catch {
      feedback.textContent = "Copie impossible. Veuillez copier manuellement.";
    }
  };
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
