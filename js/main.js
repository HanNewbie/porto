'use strict';

/* ═══════════════════════════════════════
   THEME TOGGLE — dark / light
═══════════════════════════════════════ */
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');

// Load saved theme (default: dark)
const saved = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', saved);

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});


/* ═══════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════ */
const cursor = document.getElementById('cursor');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.classList.add('show');
}, { passive: true });

(function loop() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(loop);
})();

// Grow on hover
document.querySelectorAll('a, button, .pcard, .klink, .edu-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
});

document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
document.addEventListener('mouseenter', () => cursor.style.opacity = '');


/* ═══════════════════════════════════════
   NAVBAR — solid on scroll + mobile
═══════════════════════════════════════ */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const links = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 24);
}, { passive: true });

burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
});

links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    links.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});


/* ═══════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════ */
const typedEl = document.getElementById('typedText');

const roles = ['IT Enthusiast', 'System Analyst', 'Web Developer'];

let ri = 0, ci = 0, del = false;

(function type() {
  if (!typedEl) return;
  const w = roles[ri];
  typedEl.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);

  if (!del && ci === w.length) return setTimeout(() => { del = true; type(); }, 1800);
  if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }

  setTimeout(type, del ? 55 : 90);
})();


/* ═══════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════ */
const revealEls = document.querySelectorAll('[data-reveal]');

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = +(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('in'), delay);
    io.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => io.observe(el));


/* ═══════════════════════════════════════
   STAGGER — edu cards & project cards
═══════════════════════════════════════ */
function stagger(selector, baseDelay = 70) {
  const items = document.querySelectorAll(selector);
  const sio = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const idx = [...items].indexOf(entry.target);
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, idx * baseDelay);
      sio.unobserve(entry.target);
    });
  }, { threshold: 0.07 });

  items.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease, border-color .22s, box-shadow .25s';
    sio.observe(el);
  });
}

stagger('.edu-card', 80);
stagger('.pcard', 70);


/* ═══════════════════════════════════════
   FOOTER YEAR
═══════════════════════════════════════ */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();


/* ═══════════════════════════════════════
   PHOTO SLIDER — Proyek 1
═══════════════════════════════════════ */
function cycleSlide(sliderId) {
  const wrapper = document.getElementById(sliderId);
  if (!wrapper) return;

  const imgs = wrapper.querySelectorAll('.slide-img');
  const dots = wrapper.querySelectorAll('.dot');
  let current = [...imgs].findIndex(img => img.classList.contains('active'));

  // Ripple effect at click centre
  const ripple = document.createElement('span');
  ripple.className = 'slide-ripple';
  ripple.style.left = '50%';
  ripple.style.top = '50%';
  wrapper.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());

  // Fade-out current
  imgs[current].classList.add('flip-out');
  imgs[current].classList.remove('active');
  dots[current].classList.remove('active');

  const next = (current + 1) % imgs.length;

  setTimeout(() => {
    imgs[current].classList.remove('flip-out');

    imgs[next].classList.add('slide-enter');
    imgs[next].classList.add('active');
    dots[next].classList.add('active');

    imgs[next].addEventListener('animationend', () => {
      imgs[next].classList.remove('slide-enter');
    }, { once: true });
  }, 220);
}

// Grow cursor on slider hover
document.querySelectorAll('.pcard-slider').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
});
