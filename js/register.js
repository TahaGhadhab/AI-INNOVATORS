/* =========================================================
   Registration form: validation, submission to Google Sheets,
   loading / success / error states.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- CONFIG ---------------- */
  // Paste your Google Apps Script web app URL here (see README → "Connect the Google Sheet").
  // While empty, the form runs in DEMO MODE: it validates and shows success without saving anything.
  const APPS_SCRIPT_URL = '';
  // Set to your college's email domain (e.g. 'univ-example.edu') to accept only student emails.
  const EMAIL_DOMAIN = '';
  /* ---------------------------------------- */

  const form = document.getElementById('register-form');
  if (!form) return;

  const success = document.getElementById('success');
  const successName = document.getElementById('success-name');
  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('[type="submit"]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t = (key) => (window.i18n ? window.i18n.t(key) : key);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^\+?[0-9\s().-]{8,20}$/;

  // Each rule returns true, or the translation key of the error message.
  const rules = {
    fullName: (v) => (!v ? 'err.required' : v.length >= 2 || 'err.name'),
    email: (v) => {
      if (!v) return 'err.required';
      if (!EMAIL_RE.test(v)) return 'err.email';
      if (EMAIL_DOMAIN && !v.toLowerCase().endsWith('@' + EMAIL_DOMAIN.toLowerCase())) return 'err.domain';
      return true;
    },
    phone: (v) => (!v ? 'err.required' : PHONE_RE.test(v) || 'err.phone'),
    studentId: (v) => !!v || 'err.required',
    year: (v) => !!v || 'err.choose',
    department: (v) => !!v || 'err.choose',
    interests: () => form.querySelectorAll('input[name="interests"]:checked').length > 0 || 'err.interests',
    experience: () => !!form.querySelector('input[name="experience"]:checked') || 'err.choose',
    consent: () => form.elements.consent.checked || 'err.consent'
  };

  const dirty = new Set();
  let statusKey = '';
  let sending = false;

  function valueOf(name) {
    const el = form.elements[name];
    return el && typeof el.value === 'string' ? el.value.trim() : '';
  }

  function setError(name, key) {
    const wrap = form.querySelector('[data-name="' + name + '"]');
    const err = document.getElementById(name + '-error');
    if (wrap) wrap.classList.toggle('is-invalid', !!key);
    form.querySelectorAll('[name="' + name + '"]').forEach((c) => {
      if (key) c.setAttribute('aria-invalid', 'true'); else c.removeAttribute('aria-invalid');
    });
    if (!err) return;
    if (key) { err.dataset.errKey = key; err.textContent = t(key); }
    else { delete err.dataset.errKey; err.textContent = ''; }
  }

  function validate(name) {
    const result = rules[name](valueOf(name));
    const key = result === true ? '' : result;
    setError(name, key);
    return !key;
  }

  function setStatus(key) {
    statusKey = key;
    status.textContent = key ? t(key) : '';
  }

  function setSending(on) {
    sending = on;
    submitBtn.disabled = on;
    submitBtn.classList.toggle('is-loading', on);
    submitBtn.setAttribute('aria-busy', String(on));
  }

  /* ---- Live validation: after a field has been touched ---- */
  form.addEventListener('input', (e) => {
    const name = e.target.name;
    if (!rules[name]) return;
    dirty.add(name);
    const isGroup = e.target.type === 'checkbox' || e.target.type === 'radio';
    const wrap = form.querySelector('[data-name="' + name + '"]');
    if (isGroup || (wrap && wrap.classList.contains('is-invalid'))) validate(name);
  });
  form.addEventListener('change', (e) => {
    const name = e.target.name;
    if (rules[name] && e.target.tagName === 'SELECT') { dirty.add(name); validate(name); }
  });
  form.addEventListener('focusout', (e) => {
    const name = e.target.name;
    if (rules[name] && dirty.has(name) && e.target.type !== 'checkbox' && e.target.type !== 'radio') validate(name);
  });

  /* ---- Payload ---- */
  function payload() {
    const body = new URLSearchParams();
    ['fullName', 'email', 'phone', 'studentId', 'department', 'year', 'experience', 'motivation', 'source', 'website']
      .forEach((name) => body.append(name, valueOf(name)));
    ['interests', 'roles'].forEach((name) => {
      const checked = Array.from(form.querySelectorAll('input[name="' + name + '"]:checked')).map((i) => i.value);
      body.append(name, checked.join(', '));
    });
    body.append('consent', 'yes');
    body.append('lang', window.i18n ? window.i18n.lang : 'fr');
    return body;
  }

  async function send(body) {
    if (!APPS_SCRIPT_URL) {
      console.info('[register] DEMO MODE: set APPS_SCRIPT_URL in js/register.js to save entries. Payload:', Object.fromEntries(body));
      await new Promise((resolve) => setTimeout(resolve, 900));
      return 'success';
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      // URLSearchParams body = "simple" request: no CORS preflight, which Apps Script can't answer.
      const res = await fetch(APPS_SCRIPT_URL, { method: 'POST', body, signal: controller.signal });
      const data = await res.json();
      return data.result;
    } finally {
      clearTimeout(timer);
    }
  }

  function showSuccess() {
    successName.textContent = valueOf('fullName').split(/\s+/)[0] || '';
    form.hidden = true;
    success.hidden = false;
    success.focus({ preventScroll: true });
    success.closest('.card').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    setStatus('');

    const invalid = Object.keys(rules).filter((name) => !validate(name));
    if (invalid.length) {
      invalid.forEach((name) => dirty.add(name));
      setStatus('err.fix');
      const first = form.querySelector('[name="' + invalid[0] + '"]');
      if (first) {
        first.closest('.field').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        first.focus({ preventScroll: true });
      }
      return;
    }

    // Honeypot filled → a bot. Pretend it worked and send nothing.
    if (valueOf('website')) { showSuccess(); return; }

    setSending(true);
    try {
      const result = await send(payload());
      if (result === 'success') showSuccess();
      else if (result === 'duplicate') setStatus('err.duplicate');
      else throw new Error('Unexpected response: ' + result);
    } catch (err) {
      console.error('[register]', err);
      setStatus('err.network');
    } finally {
      setSending(false);
    }
  });

  /* ---- "Register someone else" ---- */
  document.querySelector('[data-register-again]').addEventListener('click', () => {
    form.reset();
    Object.keys(rules).forEach((name) => setError(name, ''));
    dirty.clear();
    setStatus('');
    success.hidden = true;
    form.hidden = false;
    form.elements.fullName.focus();
  });

  /* ---- Re-translate visible messages when the language changes ---- */
  document.addEventListener('langchange', () => {
    form.querySelectorAll('.field__error[data-err-key]').forEach((el) => { el.textContent = t(el.dataset.errKey); });
    if (statusKey) status.textContent = t(statusKey);
  });
})();
