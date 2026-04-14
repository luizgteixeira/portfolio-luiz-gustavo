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

function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'height:2px',
    'z-index:9998',
    'background:linear-gradient(90deg,#F2B279,#F2DDD5,#F2B999)',
    'background-size:200% 100%',
    'width:0%',
    'pointer-events:none',
    'transition:width .08s linear',
    'animation:progress-shimmer 2s linear infinite',
    'box-shadow:0 0 8px rgba(242,178,121,0.5)',
  ].join(';');

  document.head.insertAdjacentHTML(
    'beforeend',
    '<style>@keyframes progress-shimmer{0%{background-position:0%}100%{background-position:200%}}</style>'
  );
  document.body.prepend(progressBar);

  const updateProgress = () => {
    const scrollableHeight = document.body.scrollHeight - window.innerHeight;
    const percentage =
      scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(percentage, 100)}%`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
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

  menuToggle.setAttribute('aria-label', 'Abrir menu principal');

  const closeMenu = () => {
    siteNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu principal');
  };

  const openMenu = () => {
    siteNav.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fechar menu principal');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
      return;
    }
    openMenu();
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (siteNav.contains(target) || menuToggle.contains(target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu();
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

function initHeroParticles() {
  const hero = document.querySelector('.hero');
  if (!hero || prefersReducedMotion || window.innerWidth < 900) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = [
    'position:absolute',
    'inset:0',
    'width:100%',
    'height:100%',
    'pointer-events:none',
    'z-index:0',
    'opacity:0.5',
  ].join(';');
  hero.prepend(canvas);

  const context = canvas.getContext('2d');
  if (!context) return;

  let width = 0;
  let height = 0;
  let particles = [];
  const particleCount = Math.max(18, Math.min(36, Math.round(window.innerWidth / 40)));

  function resize() {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  function createParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.12 + Math.random() * 0.18;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1.2 + Math.random() * 1.3,
      alpha: 0.18 + Math.random() * 0.22,
    };
  }

  function initialize() {
    resize();
    particles = Array.from({ length: particleCount }, createParticle);
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
    });

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const first = particles[i];
        const second = particles[j];
        const deltaX = first.x - second.x;
        const deltaY = first.y - second.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > 110) continue;

        context.beginPath();
        context.strokeStyle = `rgba(242,178,121,${0.16 * (1 - distance / 110)})`;
        context.lineWidth = 0.5;
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);
        context.stroke();
      }
    }

    particles.forEach((particle) => {
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(242,221,213,${particle.alpha})`;
      context.fill();
    });

    requestAnimationFrame(draw);
  }

  initialize();
  draw();
  window.addEventListener('resize', initialize);
}

function initKickerBlink() {
  const kicker = document.querySelector('.hero-kicker');
  if (!kicker || prefersReducedMotion) return;

  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.style.cssText = [
    'color:var(--gold)',
    'font-weight:300',
    'margin-left:4px',
    'animation:kicker-blink .9s step-end infinite',
  ].join(';');

  document.head.insertAdjacentHTML(
    'beforeend',
    '<style>@keyframes kicker-blink{0%,100%{opacity:1}50%{opacity:0}}</style>'
  );
  kicker.appendChild(cursor);
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

initRevealObserver();
initScrollProgress();
initHeaderState();
initMobileMenu();
initContactForm();
initHeroParticles();
initKickerBlink();
initProductPage();
