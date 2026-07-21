/* ============================================================
   Essential Odontologia — script.js
   Menu mobile, navbar dinâmica, reveal on scroll, tilt 3D
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) document.body.classList.add("reduced-motion");

  /* ---------- 1. Menu mobile ---------- */
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- 2. Navbar muda ao rolar a página ---------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 3. Revelar seções ao rolar a página ---------- */
  const revealItems = document.querySelectorAll("[data-reveal]");
  revealItems.forEach((el, index) => {
    el.style.setProperty("--reveal-delay", `${(index % 4) * 0.12}s`);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- 4. Rotação 3D da "pérola" no hero ---------- */
  const pearl = document.getElementById("pearl");
  const heroVisual = document.getElementById("heroVisual");
  let autoAngle = 0;
  let tiltX = 0;
  let tiltY = 0;

  function renderPearl() {
    if (pearl) {
      pearl.style.transform = `rotateX(${tiltX}deg) rotateY(${
        autoAngle + tiltY
      }deg)`;
    }
    if (!prefersReducedMotion) {
      autoAngle += 0.15;
      requestAnimationFrame(renderPearl);
    }
  }
  requestAnimationFrame(renderPearl);

  if (heroVisual && !prefersReducedMotion) {
    heroVisual.addEventListener("mousemove", (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tiltY = x * 26;
      tiltX = y * -18;
    });
    heroVisual.addEventListener("mouseleave", () => {
      tiltX = 0;
      tiltY = 0;
    });
  }

  /* ---------- 5. Tilt 3D nos cartões (serviços, equipe, sobre) ---------- */
  if (!prefersReducedMotion) {
    const tiltEls = document.querySelectorAll(
      ".service-card, .team-card, .about-photo"
    );

    tiltEls.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = x * 10;
        const rotateX = y * -10;
        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
      });
    });
  }
});