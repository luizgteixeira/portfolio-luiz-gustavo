// Mantemos apenas interações essenciais: revelação, cabeçalho, menu,
// formulário, vídeos e acessibilidade. Efeitos decorativos
// não utilizados foram removidos para evitar código morto.

'use strict';

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

function markVisible(element) {
  element.classList.add('is-visible');

  if (element.classList.contains('skill-item')) {
    element.classList.add('is-visible');
  }

  element.querySelectorAll('.skill-item').forEach((item) => {
    item.classList.add('is-visible');
  });
}

function initRevealObserver() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    revealElements.forEach(markVisible);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        markVisible(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.08,
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initHeaderState() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');

  if (!menuToggle || !siteNav) return;

  const isMobile = () => window.matchMedia('(max-width: 980px)').matches;

  const setMenuState = (isOpen, options = {}) => {
    siteNav.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('is-menu-open', isOpen);

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Fechar menu principal' : 'Abrir menu principal'
    );

    if (isMobile()) {
      siteNav.setAttribute('aria-hidden', String(!isOpen));
    } else {
      siteNav.removeAttribute('aria-hidden');
    }

    if (!isOpen && options.restoreFocus) {
      menuToggle.focus();
    }
  };

  const closeMenu = (options = {}) => setMenuState(false, options);
  const openMenu = () => setMenuState(true);

  const toggleMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      closeMenu({ restoreFocus: true });
      return;
    }

    openMenu();
  };

  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu principal');

  if (isMobile()) {
    siteNav.setAttribute('aria-hidden', 'true');
  }

  menuToggle.addEventListener('click', toggleMenu);
  menuToggle.addEventListener('touchend', toggleMenu, { passive: false });

  siteNav.addEventListener('click', (event) => {
    event.stopPropagation();

    const target = event.target;
    if (target instanceof Element && target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (menuToggle.contains(target) || siteNav.contains(target)) return;

    closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    }
  });

  window.addEventListener('resize', () => {
    if (!isMobile()) {
      closeMenu();
      siteNav.removeAttribute('aria-hidden');
      return;
    }

    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    siteNav.setAttribute('aria-hidden', String(!isOpen));
  });
}


function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const status = document.getElementById('formStatus');
  const recipient =
    contactForm.getAttribute('data-recipient') ||
    contactForm.getAttribute('action')?.replace(/^mailto:/i, '') ||
    'contato@luizgustavodev.com';

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity() || !submitButton) return;

    const formData = new FormData(contactForm);
    const nome = String(formData.get('nome') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const assunto = String(formData.get('assunto') || '').trim();
    const mensagem = String(formData.get('mensagem') || '').trim();

    const mailto =
      `mailto:${recipient}` +
      '?subject=' +
      encodeURIComponent(`[Site] ${assunto}`) +
      '&body=' +
      encodeURIComponent(
        `Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`
      );

    const originalLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Abrindo e-mail...';

    if (status) {
      status.textContent =
        'Abrindo seu aplicativo de e-mail com a mensagem preenchida.';
    }

    window.location.href = mailto;

    window.setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }, 1800);
  });
}

function initProjectVideos() {
  const videos = Array.from(document.querySelectorAll('.project-video'));
  if (!videos.length) return;

  // Respeita a preferência do usuário: mantém apenas o poster estático, sem autoplay.
  if (prefersReducedMotion) return;

  const playVideo = (video) => {
    video.muted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        video.setAttribute('data-video-paused', 'true');
      });
    }
  };

  if (!('IntersectionObserver' in window)) {
    videos.forEach(playVideo);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (!(video instanceof HTMLVideoElement)) return;

        if (entry.isIntersecting) {
          playVideo(video);
          return;
        }

        video.pause();
      });
    },
    {
      rootMargin: '120px 0px',
      threshold: 0.2,
    }
  );

  videos.forEach((video) => observer.observe(video));
}

initRevealObserver();
initHeaderState();
initMobileMenu();
initContactForm();
initProjectVideos();
