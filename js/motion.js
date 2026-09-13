/* =========================================================
   Motion helpers (styles live in css/motion.css)
   - Splits h1/h2 .display headings into word spans so they build
     word by word. Re-splits after every language switch and replays.
   - Counts stat numbers up when they scroll into view.
   ========================================================= */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HEADINGS = 'h1.display, h2.display';

  /* ---- Word-by-word headings ---- */
  function wordSpan(index) {
    const w = document.createElement('span');
    w.className = 'w';
    w.style.setProperty('--wi', index);
    return w;
  }

  function lastWord(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return null;
    if (node.classList.contains('w')) return node;
    const words = node.querySelectorAll('.w');
    return words.length ? words[words.length - 1] : null;
  }

  function split(el) {
    let index = 0;
    const walk = (parent) => {
      Array.from(parent.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part, k) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            // Punctuation glued to an element ("<em>word</em>.") joins that word so it never wraps alone.
            const prev = k === 0 ? lastWord(child.previousSibling) : null;
            if (prev) { prev.appendChild(document.createTextNode(part)); return; }
            const w = wordSpan(index++);
            w.textContent = part;
            frag.appendChild(w);
          });
          parent.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          if (child.classList.contains('glow')) {
            const w = wordSpan(index++);
            child.replaceWith(w);
            w.appendChild(child);
          } else {
            walk(child);
          }
        }
      });
    };
    walk(el);
    el.classList.add('split');
  }

  function splitHeadings(replay) {
    document.querySelectorAll(HEADINGS).forEach((el) => {
      if (el.closest('#success') || el.querySelector('.w')) return;
      split(el);
      // Already on screen (language switch): play the words again right away.
      el.classList.toggle('split--replay', !!replay && !!el.closest('.is-in'));
    });
  }

  /* ---- Stat counters ---- */
  function countUp(el) {
    const match = /^(\d+)(.*)$/.exec(el.textContent.trim());
    if (!match || match[1] === '0') return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statObserver = !reduced && 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          statObserver.unobserve(entry.target);
          countUp(entry.target);
        });
      }, { threshold: 0.6 })
    : null;

  function observeStats() {
    if (!statObserver) return;
    document.querySelectorAll('.stat__value:not([data-counted])').forEach((el) => {
      el.setAttribute('data-counted', '');
      statObserver.observe(el);
    });
  }

  document.addEventListener('langchange', () => { splitHeadings(true); observeStats(); });
  splitHeadings(false);
  observeStats();
})();
