/* =========================================================
   FR / EN switcher
   Markup hooks:
     data-i18n="key"              → textContent
     data-i18n-html="key"         → innerHTML (for <em>, <br>…)
     data-i18n-placeholder="key"  → placeholder attribute
     data-i18n-aria="key"         → aria-label attribute
     data-i18n-content="key"      → content attribute (<meta>)
     data-i18n-list="key" data-template="tpl-id"
                                  → repeats <template> once per array item;
                                    inside it, [data-field="prop"] gets item.prop,
                                    [data-field-attr="attr:prop"] sets an attribute,
                                    [data-index] gets 01, 02, …
     data-lang-btn="fr|en"        → language toggle button
   Fires a "langchange" event on document after every switch.
   Switching is animated: visible text blurs out, swaps, then fades back in.
   ========================================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'ai-innovators-lang';
  const FALLBACK = 'fr';
  const TEXT = '[data-i18n], [data-i18n-html], [data-i18n-list]';
  const dict = window.I18N || {};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = FALLBACK;
  let switching = false;

  function detect() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && dict[saved]) return saved;
    } catch (e) { /* storage blocked */ }
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return /^en\b/i.test(nav) ? 'en' : FALLBACK;
  }

  function t(key, lang) {
    const own = dict[lang || current] || {};
    if (Object.prototype.hasOwnProperty.call(own, key)) return own[key];
    const fb = dict[FALLBACK] || {};
    return Object.prototype.hasOwnProperty.call(fb, key) ? fb[key] : key;
  }

  const each = (sel, fn) => document.querySelectorAll(sel).forEach(fn);
  const pad = (n) => String(n).padStart(2, '0');

  function within(node, sel) {
    const list = Array.from(node.querySelectorAll(sel));
    if (node.matches(sel)) list.unshift(node);
    return list;
  }

  function fillItem(node, item, index) {
    within(node, '[data-index]').forEach((el) => { el.textContent = pad(index + 1); });
    within(node, '[data-field]').forEach((el) => {
      const value = item[el.getAttribute('data-field')];
      el.innerHTML = Array.isArray(value)
        ? value.map((v) => '<li>' + v + '</li>').join('')
        : (value == null ? '' : value);
    });
    within(node, '[data-field-attr]').forEach((el) => {
      el.getAttribute('data-field-attr').split(',').forEach((pair) => {
        const [attr, prop] = pair.split(':').map((s) => s.trim());
        if (item[prop] != null) el.setAttribute(attr, item[prop]);
      });
    });
  }

  function renderList(container) {
    const items = t(container.dataset.i18nList);
    const tpl = document.getElementById(container.dataset.template);
    if (!Array.isArray(items) || !tpl) return;
    // Reuse existing nodes when the count matches, so reveal state isn't lost on toggle.
    if (container.children.length !== items.length) {
      container.textContent = '';
      items.forEach(() => container.appendChild(tpl.content.firstElementChild.cloneNode(true)));
    }
    Array.from(container.children).forEach((node, i) => fillItem(node, items[i], i));
  }

  function apply(lang, remember) {
    if (!dict[lang]) lang = FALLBACK;
    current = lang;
    document.documentElement.lang = lang;

    each('[data-i18n]', (el) => { el.textContent = t(el.dataset.i18n); });
    each('[data-i18n-html]', (el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    each('[data-i18n-placeholder]', (el) => { el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder)); });
    each('[data-i18n-aria]', (el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    each('[data-i18n-content]', (el) => { el.setAttribute('content', t(el.dataset.i18nContent)); });
    each('[data-i18n-list]', renderList);
    each('[data-lang-btn]', (b) => { b.setAttribute('aria-pressed', String(b.dataset.langBtn === lang)); });
    each('.lang', (group) => { group.dataset.active = lang; }); // drives the sliding thumb

    if (remember) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage blocked */ }
    }
    document.documentElement.classList.remove('i18n-pending');
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  // Translatable elements currently on screen, outermost only, top to bottom.
  function onScreen() {
    const vh = window.innerHeight;
    const list = Array.from(document.body.querySelectorAll(TEXT)).filter((el) => {
      if (el.closest('select')) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < vh;
    });
    return list
      .filter((el) => !list.some((other) => other !== el && other.contains(el)))
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  }

  function switchLang(lang) {
    if (!dict[lang] || lang === current || switching) return;
    if (reduced || typeof Element.prototype.animate !== 'function') { apply(lang, true); return; }

    switching = true;
    const targets = onScreen();
    // Opacity + blur only: transforms would fight elements already positioned by CSS/JS.
    const outs = targets.map((el) => el.animate(
      [{ opacity: 0, filter: 'blur(6px)' }],
      { duration: 180, easing: 'ease-in', fill: 'forwards' }
    ));

    Promise.all(outs.map((a) => a.finished)).catch(() => {}).then(() => {
      apply(lang, true);
      targets.forEach((el, i) => {
        if (el.classList.contains('split')) return; // headings replay word by word (js/motion.js)
        el.animate(
          [{ opacity: 0, filter: 'blur(6px)', offset: 0 }],
          { duration: 520, delay: Math.min(i, 14) * 28, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'backwards' }
        );
      });
      outs.forEach((a) => a.cancel());
      switching = false;
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lang-btn]');
    if (btn) switchLang(btn.dataset.langBtn);
  });

  window.i18n = {
    t: (key) => t(key),
    get lang() { return current; },
    set: switchLang
  };

  apply(detect(), false);
})();
