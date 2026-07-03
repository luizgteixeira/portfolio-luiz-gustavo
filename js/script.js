// Mantemos apenas interações essenciais: revelação, cabeçalho, menu,
// formulário, produtos, vídeos e acessibilidade. Efeitos decorativos
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

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const isMobileMenu = () => window.innerWidth <= 980;

  const updateAriaHidden = (isOpen) => {
    if (isMobileMenu()) {
      siteNav.setAttribute('aria-hidden', String(!isOpen));
      return;
    }

    siteNav.removeAttribute('aria-hidden');
  };

  const closeMenu = ({ restoreFocus = false } = {}) => {
    siteNav.classList.remove('is-open');
    document.body.classList.remove('is-menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu principal');
    updateAriaHidden(false);

    if (restoreFocus) {
      menuToggle.focus();
    }
  };

  const openMenu = () => {
    siteNav.classList.add('is-open');
    document.body.classList.add('is-menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fechar menu principal');
    updateAriaHidden(true);

    const firstLink = siteNav.querySelector('a[href]');
    if (firstLink instanceof HTMLElement) {
      window.requestAnimationFrame(() => firstLink.focus());
    }
  };

  const toggleMenu = () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      closeMenu({ restoreFocus: true });
      return;
    }

    openMenu();
  };

  menuToggle.setAttribute('aria-label', 'Abrir menu principal');
  updateAriaHidden(false);

  menuToggle.addEventListener('click', toggleMenu);

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (siteNav.contains(target) || menuToggle.contains(target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }

    if (event.key !== 'Tab' || !isOpen || !isMobileMenu()) return;

    const focusableItems = [
      menuToggle,
      ...siteNav.querySelectorAll(focusableSelector),
    ].filter((item) => item instanceof HTMLElement);

    if (!focusableItems.length) return;

    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  window.addEventListener('resize', () => {
    if (!isMobileMenu()) {
      closeMenu();
      siteNav.removeAttribute('aria-hidden');
      return;
    }

    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    updateAriaHidden(isOpen);
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

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function initProductGallery() {
  const mainImage = document.querySelector('[data-gallery-image]');
  const thumbs = Array.from(document.querySelectorAll('[data-gallery-thumb]'));
  const prevButton = document.querySelector('[data-gallery-prev]');
  const nextButton = document.querySelector('[data-gallery-next]');
  const zoomButton = document.querySelector('[data-gallery-zoom]');
  const dialog = document.querySelector('[data-gallery-dialog]');
  const dialogImage = document.querySelector('[data-gallery-dialog-image]');
  const closeButton = document.querySelector('[data-gallery-close]');

  if (!mainImage || !thumbs.length) return;

  let currentIndex = thumbs.findIndex((thumb) =>
    thumb.classList.contains('is-active')
  );

  if (currentIndex < 0) currentIndex = 0;

  const updateGallery = (index) => {
    const safeIndex = (index + thumbs.length) % thumbs.length;
    const activeThumb = thumbs[safeIndex];
    const image = activeThumb.getAttribute('data-image') || '';
    const alt = activeThumb.getAttribute('data-alt') || mainImage.alt;

    currentIndex = safeIndex;
    mainImage.src = image;
    mainImage.alt = alt;

    if (dialogImage) {
      dialogImage.src = image;
      dialogImage.alt = alt;
    }

    thumbs.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle('is-active', thumbIndex === safeIndex);
    });
  };

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => updateGallery(index));
  });

  prevButton?.addEventListener('click', () => updateGallery(currentIndex - 1));
  nextButton?.addEventListener('click', () => updateGallery(currentIndex + 1));

  if (dialog && dialogImage && typeof dialog.showModal === 'function') {
    zoomButton?.addEventListener('click', () => {
      dialog.showModal();
    });

    closeButton?.addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && dialog.open) dialog.close();
    });
  } else {
    zoomButton?.setAttribute('hidden', 'hidden');
  }

  updateGallery(currentIndex);
}

function initProductPricing() {
  const priceCard = document.querySelector('[data-price-card]');
  const currentPrice = document.querySelector('[data-price-current]');
  const oldPrice = document.querySelector('[data-price-old]');
  const discountElement = document.querySelector('[data-price-discount]');

  if (!priceCard || !currentPrice || !oldPrice || !discountElement) return;

  const basePrice = Number(priceCard.getAttribute('data-base-price'));
  const salePrice = Number(priceCard.getAttribute('data-sale-price'));

  if (!Number.isFinite(basePrice) || !Number.isFinite(salePrice)) return;

  const hasDiscount = salePrice > 0 && salePrice < basePrice;
  currentPrice.textContent = formatCurrency(hasDiscount ? salePrice : basePrice);
  oldPrice.textContent = hasDiscount ? formatCurrency(basePrice) : '';
  oldPrice.hidden = !hasDiscount;

  if (!hasDiscount) {
    discountElement.hidden = true;
    return;
  }

  const discount = Math.round(((basePrice - salePrice) / basePrice) * 100);
  discountElement.textContent = `${discount}% OFF`;
}

function initProductQuantity() {
  const quantityInput = document.querySelector('[data-quantity-input]');
  const minusButton = document.querySelector('[data-quantity-minus]');
  const plusButton = document.querySelector('[data-quantity-plus]');
  const feedback = document.querySelector('[data-cart-feedback]');
  const addToCartButton = document.querySelector('[data-add-to-cart]');

  if (!quantityInput || !minusButton || !plusButton || !feedback || !addToCartButton) {
    return;
  }

  const normalizeValue = (value) => {
    const parsed = Number.parseInt(String(value), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  };

  const syncQuantity = (nextValue) => {
    quantityInput.value = String(normalizeValue(nextValue));
  };

  minusButton.addEventListener('click', () => {
    syncQuantity(normalizeValue(quantityInput.value) - 1);
  });

  plusButton.addEventListener('click', () => {
    syncQuantity(normalizeValue(quantityInput.value) + 1);
  });

  quantityInput.addEventListener('input', () => {
    syncQuantity(quantityInput.value);
  });

  addToCartButton.addEventListener('click', () => {
    const quantity = normalizeValue(quantityInput.value);
    const label =
      quantity === 1
        ? '1 unidade exemplo adicionada ao carrinho.'
        : `${quantity} unidades exemplo adicionadas ao carrinho.`;
    feedback.textContent = `${label} Fluxo pronto para integrar com carrinho real depois.`;
  });
}

function initProductSearch() {
  const searchInput = document.querySelector('[data-product-search]');
  const searchForm = searchInput?.closest('form');
  const cards = Array.from(document.querySelectorAll('[data-product-card]'));
  const emptyState = document.querySelector('[data-search-empty]');

  if (!searchInput || !cards.length) return;

  const applyFilter = () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const terms = (card.getAttribute('data-search') || '').toLowerCase();
      const isVisible = !query || terms.includes(query);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  };

  searchInput.addEventListener('input', applyFilter);
  searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilter();
  });

  applyFilter();
}

function initProductPage() {
  if (!document.querySelector('.product-page')) return;

  initProductGallery();
  initProductPricing();
  initProductQuantity();
  initProductSearch();
}

function initProjectVideos() {
  const videos = Array.from(document.querySelectorAll('.project-video'));
  if (!videos.length) return;

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

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
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
initProductPage();
initProjectVideos();
