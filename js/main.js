/**
 * Portfolio Main JS
 * Navigation, Typed effect, Scroll reveals, Counters, Form, Custom cursor
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // LOADING SCREEN
  // ============================================
  const loader = document.querySelector('.loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader?.classList.add('loaded');
      document.body.style.overflow = 'auto';
      initHeroAnimations();
    }, 1800); /* Réduit de 2800 → 1800ms pour moins d'attente */
  });

  // ============================================
  // CUSTOM CURSOR
  // ============================================
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursorDot && cursorRing && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const interactives = document.querySelectorAll('a, button, .project-card, .skill-node, input, textarea');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ============================================
  // NAVIGATION
  // ============================================
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  /** Ouvre ou ferme le menu mobile + overlay */
  function setMenuOpen(open) {
    mobileMenu?.classList.toggle('open', open);
    mobileOverlay?.classList.toggle('open', open);
    navToggle?.classList.toggle('active', open);
    navToggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileMenu?.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  // Ouverture/fermeture via le bouton hamburger
  navToggle?.addEventListener('click', () => {
    const willOpen = !mobileMenu?.classList.contains('open');
    setMenuOpen(willOpen);
  });

  // Fermer via le bouton X — joue l'animation de fermeture avant de fermer
  mobileMenuClose?.addEventListener('click', () => {
    mobileMenuClose.classList.add('closing');
    // 280ms = durée animation fermeture (0.2s + 0.05s délai + marge)
    setTimeout(() => {
      mobileMenuClose.classList.remove('closing');
      setMenuOpen(false);
    }, 280);
  });

  // Fermer via le backdrop sombre
  mobileOverlay?.addEventListener('click', () => setMenuOpen(false));

  // Fermer le menu mobile au clic sur un lien de navigation
  mobileMenu?.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // ============================================
  // TYPED EFFECT (vanilla, no library needed)
  // ============================================
  function initHeroAnimations() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Animation d'entrée lettre par lettre + effet magnétique ──
    // Les .char sont créés ici puis immédiatement écoutés pour le magnétisme.
    // Important : tout se fait dans initHeroAnimations pour éviter que des
    // refs stales pointent vers des éléments remplacés par innerHTML.
    if (!reducedMotion) {
      document.querySelectorAll('.hero-name-first, .hero-name-last').forEach((nameEl, spanIdx) => {
        const letters = nameEl.textContent.split('');
        const baseI   = spanIdx === 1 ? 10 : 0; /* "Chenaoui" commence à --i:10 */
        nameEl.setAttribute('aria-label', nameEl.textContent);
        nameEl.innerHTML = letters.map((l, i) =>
          `<span class="char" style="--i:${i + baseI}" aria-hidden="true">${l === ' ' ? '&nbsp;' : l}</span>`
        ).join('');
      });

      // ── Effet magnétique — doit venir APRÈS la création des .char ──
      // On écoute le mousemove sur .hero-name et on met à jour --lift
      // sur chaque lettre selon sa distance à la souris.
      const heroName = document.querySelector('.hero-name');
      if (heroName && window.innerWidth > 768) {
        const chars = heroName.querySelectorAll('.char'); /* refs fraîches */
        const RADIUS = 110; /* pixels d'influence */

        heroName.addEventListener('mousemove', (e) => {
          const mx = e.clientX, my = e.clientY;
          chars.forEach(c => {
            const r    = c.getBoundingClientRect();
            const dist = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
            const t    = Math.max(0, 1 - dist / RADIUS); /* 0→1 */
            c.style.setProperty('--lift', (t * 18).toFixed(1));
          });
        });

        /* Retour en douceur quand la souris quitte le titre (transition CSS) */
        heroName.addEventListener('mouseleave', () => {
          chars.forEach(c => c.style.setProperty('--lift', '0'));
        });
      }
    }

    const typedEl = document.getElementById('typed-text');
    if (!typedEl) return;

    const strings = [
      'Developpeur Web Frontend',
      'Createur d\'experiences digitales',
      'Passione par le design UI/UX',
      'Specialiste HTML, CSS & JavaScript',
    ];

    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
      const current = strings[stringIndex];

      if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
      }

      if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause before deleting
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
        typeSpeed = 500; // Pause before typing new
      }

      setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
  }

  // ============================================
  // SECTION TITLE WAVE + INTERACTION SOURIS
  // ============================================
  // Découpe chaque .section-title en lettres .section-char.
  // CSS gère la vague continue (translate), JS met à jour --lift au survol.
  // Desktop uniquement — pas de survol possible sur mobile.
  function initSectionTitleInteractions() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    document.querySelectorAll('.section-title').forEach(titleEl => {
      // Garde le texte brut pour les lecteurs d'écran
      titleEl.setAttribute('aria-label', titleEl.textContent);

      // Découpage récursif : préserve les wrappers .accent
      let charIndex = 0;
      function splitNode(node, parent) {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'section-char';
            span.style.setProperty('--i', charIndex++);
            span.setAttribute('aria-hidden', 'true');
            span.textContent = char === ' ' ? '\u00A0' : char;
            parent.appendChild(span);
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Recrée le wrapper (ex: <span class="accent">) avec ses chars à l'intérieur
          const wrapper = document.createElement('span');
          wrapper.className = node.className;
          Array.from(node.childNodes).forEach(child => splitNode(child, wrapper));
          parent.appendChild(wrapper);
        }
      }

      const originalChildren = Array.from(titleEl.childNodes);
      titleEl.innerHTML = '';
      originalChildren.forEach(child => splitNode(child, titleEl));

      // Interaction souris — met à jour --lift sur chaque lettre selon la distance
      const chars = titleEl.querySelectorAll('.section-char');
      const RADIUS = 100; // px d'influence autour du curseur

      titleEl.addEventListener('mousemove', e => {
        chars.forEach(char => {
          const rect = char.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
          const strength = Math.max(0, 1 - dist / RADIUS);
          // strength 0→1 : 0 = loin, 1 = sous le curseur → lift max 14px
          char.style.setProperty('--lift', (strength * 14).toFixed(1));
        });
      });

      // Remet toutes les lettres en place au départ de la souris
      titleEl.addEventListener('mouseleave', () => {
        chars.forEach(c => c.style.setProperty('--lift', 0));
      });
    });
  }

  initSectionTitleInteractions();

  // ============================================
  // SCROLL REVEAL
  // ============================================
  const revealElements = document.querySelectorAll('.reveal, .stagger-item');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        const suffix = entry.target.dataset.suffix || '';
        animateCounter(entry.target, target, suffix);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el, target, suffix) {
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ============================================
  // CV DOWNLOAD — fallback si fichier absent
  // ============================================
  const cvBtn = document.getElementById('cv-btn');
  if (cvBtn) {
    cvBtn.addEventListener('click', async (e) => {
      // On tente de fetcher le fichier ; si 404, on affiche un message
      try {
        const res = await fetch(cvBtn.href, { method: 'HEAD' });
        if (!res.ok) throw new Error('not found');
        // Si OK, le téléchargement natif se fait normalement
      } catch {
        e.preventDefault();
        // Message contextuel sous le bouton CV
        let msg = document.getElementById('cv-fallback-msg');
        if (!msg) {
          msg = document.createElement('p');
          msg.id = 'cv-fallback-msg';
          msg.style.cssText = 'font-size:.75rem;color:var(--text-muted);margin-top:.5rem;text-align:center;opacity:0;transition:opacity .3s';
          cvBtn.parentElement.appendChild(msg);
        }
        msg.textContent = 'CV disponible sur demande — contactez-moi ci-dessous.';
        msg.style.opacity = '1';
        setTimeout(() => { msg.style.opacity = '0'; }, 4000);
      }
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // CONTACT FORM
  // ============================================
  const form = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Envoi en cours...</span>';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formMessage.className = 'form-message success';
        formMessage.textContent = 'Message envoye avec succes ! Je vous repondrai rapidement.';
        form.reset();
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (err) {
      formMessage.className = 'form-message error';
      formMessage.textContent = 'Une erreur est survenue. Veuillez reessayer.';
    }

    btn.innerHTML = originalText;
    btn.disabled = false;

    setTimeout(() => {
      formMessage.className = 'form-message';
      formMessage.textContent = '';
    }, 5000);
  });

  // L'effet magnétique est initialisé dans initHeroAnimations()
  // après la création des .char, pour éviter les refs stales.

  // ============================================
  // PARALLAX ON MOUSE MOVE (hero)
  // ============================================
  const hero = document.querySelector('.hero');
  hero?.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Cible hero-inner (renommé depuis hero-content)
    const inner = hero.querySelector('.hero-inner');
    if (inner) {
      // transform composite = 60fps, pas de layout
      inner.style.transform = `translate(${x * -8}px, ${y * -8}px)`;
    }
  });

  // Reset au mouseleave pour éviter un état bloqué
  hero?.addEventListener('mouseleave', () => {
    const inner = hero.querySelector('.hero-inner');
    if (inner) inner.style.transform = 'translate(0,0)';
  });

  // ============================================
  // STAGGER INDEX — Injecte --i sur les cartes projets
  // ============================================
  // Permet au CSS d'utiliser calc(var(--i) * 80ms) pour le délai staggeré
  document.querySelectorAll('.projects-grid .project-card').forEach((card, i) => {
    card.style.setProperty('--i', i);
  });

  // ============================================
  // PROJECT CARDS TILT EFFECT
  // ============================================
  // Le tilt 3D suit la souris instantanément (pas de transition CSS).
  // Au mouseleave, on ajoute une transition temporaire pour un retour fluide.
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'border-color 0.3s ease, box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -8;
      const rotateY = (x - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      // Transition douce pour le retour a plat uniquement
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease';
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
});
