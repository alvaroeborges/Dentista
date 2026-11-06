/* ============================================================
   Essential Odontologia — script.js
   Menu mobile, navbar dinâmica, reveal on scroll, tilt 3D
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  // Tilt só faz sentido com mouse; em touch o mousemove não existe.
  const hasFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;
  if (prefersReducedMotion) document.body.classList.add("reduced-motion");

  /* ---------- 1. Menu mobile ---------- */
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const navbar = document.getElementById("navbar");

  const setMenu = (open) => {
    mobileMenu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };

  menuBtn.addEventListener("click", () => {
    setMenu(!mobileMenu.classList.contains("open"));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  // Fecha com Esc e devolve o foco ao botão
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  // Fecha ao clicar fora da navbar
  document.addEventListener("click", (e) => {
    if (mobileMenu.classList.contains("open") && !navbar.contains(e.target)) {
      setMenu(false);
    }
  });

  /* ---------- 2. Navbar muda ao rolar a página ---------- */
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

  /* ---------- 4. Balanço 3D do dente no hero ---------- */
  const pearl = document.getElementById("pearl");
  const pearlShadow = document.getElementById("pearlShadow");
  const heroVisual = document.getElementById("heroVisual");
  let time = 0;
  let tiltX = 0;
  let tiltY = 0;
  let rafId = null;

  function renderPearl() {
    // Balanço senoidal (não um giro de 360°): mantém o dente sempre de frente,
    // evitando o "flip" visual de uma imagem plana vista de perfil.
    const sway = Math.sin(time) * 14;
    const bob = Math.sin(time * 1.3) * 10;

    pearl.style.transform = `translateY(${bob}px) rotateX(${tiltX}deg) rotateY(${
      sway + tiltY
    }deg)`;
    if (pearlShadow) {
      // bob > 0 move o dente para baixo (mais perto do "chão"), então a sombra
      // deve crescer e escurecer; bob < 0 (subindo) encolhe e some um pouco.
      pearlShadow.style.transform = `scale(${1 + bob / 70})`;
      pearlShadow.style.opacity = String(0.65 + bob / 45);
    }
    time += 0.012;
    rafId = requestAnimationFrame(renderPearl);
  }

  const startPearl = () => {
    if (rafId === null) rafId = requestAnimationFrame(renderPearl);
  };
  const stopPearl = () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  };

  if (pearl && heroVisual && !prefersReducedMotion) {
    // Só anima enquanto o hero está visível — economiza bateria no celular.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries[0].isIntersecting ? startPearl() : stopPearl();
      }).observe(heroVisual);
    } else {
      startPearl();
    }
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopPearl();
    });

    if (hasFinePointer) {
      heroVisual.addEventListener("mousemove", (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        tiltY = x * 18;
        tiltX = y * -12;
      });
      heroVisual.addEventListener("mouseleave", () => {
        tiltX = 0;
        tiltY = 0;
      });
    }
  }

  /* ---------- 5. Tilt 3D nos cartões (serviços, equipe, sobre) ---------- */
  if (!prefersReducedMotion && hasFinePointer) {
    const tiltEls = document.querySelectorAll(
      ".service-card, .team-card, .about-photo"
    );

    tiltEls.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        if (!card.classList.contains("in-view")) return; // não brigar com o reveal
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${y * -10}deg) rotateY(${
          x * 10
        }deg) translateY(-2px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- 6. Ano atual no rodapé ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
