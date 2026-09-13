/* =========================================================
   Shared page behavior: nav state + mobile menu, scroll reveals,
   program timeline progress, card spotlight, footer year.
   ========================================================= */
(function () {
  'use strict';

  /* ---- Nav ---- */
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const links = document.getElementById('nav-links');

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  if (toggle) toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  if (links) links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---- Reveal on scroll ---- */
  const observed = new WeakSet();
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 })
    : null;

  function observeReveals() {
    document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => {
      if (observed.has(el)) return;
      observed.add(el);
      // Items in a [data-stagger="n"] list cascade in, restarting every n items (one row).
      const parent = el.parentElement;
      if (parent && parent.hasAttribute('data-stagger')) {
        const perRow = parseInt(parent.dataset.stagger, 10) || 99;
        const index = Array.prototype.indexOf.call(parent.children, el);
        el.style.setProperty('--d', ((index % perRow) * 0.09).toFixed(2) + 's');
      }
      if (io) io.observe(el); else el.classList.add('is-in');
    });
  }

  /* ---- Program timeline fill ---- */
  const timeline = document.querySelector('[data-timeline]');
  function updateTimeline() {
    if (!timeline) return;
    const r = timeline.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.62 - r.top) / r.height));
    timeline.style.setProperty('--p', progress.toFixed(4));
  }

  function onScroll() {
    if (nav) {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      nav.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
    }
    updateTimeline();
  }

  /* ---- Activity card spotlight follows the pointer ---- */
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest && e.target.closest('.specimen');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---- Footer year ---- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateTimeline);
  document.addEventListener('langchange', observeReveals);
  onScroll();
  observeReveals();
})();
