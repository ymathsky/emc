/* ============================================
   EMC Building - Main JavaScript
   ============================================ */

// ─── Image List ──────────────────────────────
const images = [
  'IMG_2071','IMG_2075','IMG_2076','IMG_2077','IMG_2078',
  'IMG_2080','IMG_2084','IMG_2085','IMG_2086','IMG_2087',
  'IMG_2088','IMG_2089','IMG_2090','IMG_2092','IMG_2093',
  'IMG_2094','IMG_2097','IMG_2098','IMG_2099','IMG_2101',
  'IMG_2103','IMG_2104','IMG_2105','IMG_2106','IMG_2107',
  'IMG_2110','IMG_2111','IMG_2112','IMG_2114','IMG_2115',
  'IMG_2116','IMG_2117','IMG_2118','IMG_2119','IMG_2120',
  'IMG_2121','IMG_2122','IMG_2123','IMG_2124','IMG_2125',
  'IMG_2126','IMG_2127','IMG_2128','IMG_2129','IMG_2130',
  'IMG_2132','IMG_2133','IMG_2135','IMG_2136','IMG_2137',
  'IMG_2138'
];

// ─── Gallery Builder ─────────────────────────
function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  images.forEach((name, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item fade-in';
    item.dataset.index = index;
    item.innerHTML = `
      <img src="images/${name}.jpg" alt="EMC Building - Photo ${index + 1}" loading="lazy">
      <div class="gallery-item-overlay">
        <span class="gallery-zoom-icon">&#128269;</span>
      </div>
    `;
    item.addEventListener('click', () => openLightbox(index));
    grid.appendChild(item);
  });
}

// ─── Lightbox ────────────────────────────────
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const lb = document.getElementById('lightbox');
  updateLightboxImage();
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightboxImage() {
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  img.src = `images/${images[currentIndex]}.jpg`;
  img.alt = `EMC Building - Photo ${currentIndex + 1}`;
  counter.textContent = `${currentIndex + 1} / ${images.length}`;
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateLightboxImage();
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  updateLightboxImage();
}

function initLightbox() {
  const lb     = document.getElementById('lightbox');
  const close  = document.getElementById('lightboxClose');
  const prev   = document.getElementById('lightboxPrev');
  const next   = document.getElementById('lightboxNext');

  close.addEventListener('click', closeLightbox);
  prev.addEventListener('click', prevImage);
  next.addEventListener('click', nextImage);

  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevImage();
    if (e.key === 'ArrowRight')  nextImage();
  });

  // Touch/swipe support
  let touchStartX = 0;
  lb.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; });
  lb.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextImage() : prevImage();
    }
  });
}

// ─── Sticky Navbar ───────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links  = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = links.classList.contains('open')
      ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = links.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = links.classList.contains('open')
      ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  // Close nav when link clicked
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });
}

// ─── Smooth Scroll ───────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 74;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ─── Scroll Animations ───────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ─── Add fade-in to sections ─────────────────
function addFadeInClasses() {
  const selectors = [
    '.feature-card',
    '.space-card',
    '.about-text',
    '.about-images',
    '.contact-info',
    '.contact-form-wrapper',
    '.video-wrapper',
    '.highlight-item',
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('fade-in');
    });
  });
}

// ─── Contact Form ─────────────────────────────
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    // Simulate sending (replace with actual endpoint or mailto)
    setTimeout(() => {
      success.classList.add('visible');
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Send Inquiry';
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1000);
  });
}

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildGallery();
  initLightbox();
  initNavbar();
  initSmoothScroll();
  addFadeInClasses();
  // Delay for gallery items to be in DOM
  setTimeout(initScrollAnimations, 100);
  initContactForm();
});
