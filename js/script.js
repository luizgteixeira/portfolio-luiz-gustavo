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
  if (!submitButton || !status) return;

  let statusClearTimer = null;
  const clearStatusLater = (delay) => {
    window.clearTimeout(statusClearTimer);
    statusClearTimer = window.setTimeout(() => {
      status.textContent = '';
      status.className = 'form-status';
    }, delay);
  };

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    // Honeypot: se o campo estiver preenchido, é um bot. Ignora silenciosamente.
    if (contactForm.botcheck && contactForm.botcheck.checked) return;

    window.clearTimeout(statusClearTimer);

    const assunto = String(new FormData(contactForm).get('assunto') || '').trim();
    const subjectField = contactForm.querySelector('#formSubjectField');
    if (subjectField && assunto) {
      subjectField.value = `[Site] ${assunto}`;
    }

    const originalLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    status.textContent = 'Enviando sua mensagem...';
    status.className = 'form-status';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Falha no envio.');
      }

      status.textContent = 'Mensagem enviada com sucesso! Vou responder em breve.';
      status.className = 'form-status success';
      contactForm.reset();
      clearStatusLater(6000);
    } catch (error) {
      status.innerHTML =
        'Não foi possível enviar agora. Tente novamente em instantes ou <a href="mailto:contato@luizgustavodev.com">escreva direto para contato@luizgustavodev.com</a>.';
      status.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  });
}

function initProjectVideos() {
  const videos = Array.from(document.querySelectorAll('.project-video'));
  if (!videos.length) return;

  videos.forEach((video) => {
    video.muted = true;
    video.playsInline = true;
  });

  // Respeita a preferência do usuário: mantém apenas o poster estático.
  if (prefersReducedMotion) return;

  const playVideo = (video) => {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  };

  const stopVideo = (video) => {
    video.pause();
    video.currentTime = 0;
  };

  videos.forEach((video) => {
    const visual = video.closest('.project-visual');
    if (!visual) return;

    const card = video.closest('.project-card');
    const linksOut = card && card.querySelector('.project-card-link');

    if (linksOut) {
      // O card inteiro já leva pro site real (o link cobre a área toda, inclusive
      // por cima do vídeo) — por isso o hover é escutado no card, não no vídeo.
      card.addEventListener('mouseenter', () => playVideo(video));
      card.addEventListener('mouseleave', () => stopVideo(video));
      return;
    }

    // Sem link externo: o clique liga e desliga o vídeo aqui mesmo.
    visual.setAttribute('role', 'button');
    visual.setAttribute('tabindex', '0');
    visual.setAttribute('aria-label', 'Reproduzir prévia em vídeo');

    const toggle = () => {
      if (video.paused) {
        playVideo(video);
        visual.classList.add('is-playing');
      } else {
        stopVideo(video);
        visual.classList.remove('is-playing');
      }
    };

    visual.addEventListener('click', toggle);
    visual.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
  });
}

initRevealObserver();
initHeaderState();
initMobileMenu();
initContactForm();
initProjectVideos();
