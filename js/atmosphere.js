/* =========================================================
   Atmosphere: floating dust, drifting mist and ground glints on a
   fixed background canvas, plus hero parallax.
   Shared by both pages. Exposes window.Atmos (helpers + frame/scroll/resize
   hooks) so other effects (js/veins.js) run in the same animation loop.

   Tweak: colors come from --bio / --accent in css/tokens.css;
   particle amount from data-density="100" on the canvas (0–220).
   ========================================================= */
(function () {
  'use strict';

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const rgba = (c, a) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
  const mix = (a, b, t) => [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t));

  function hex(c, fallback) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(c || '').trim());
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : fallback;
  }

  // Deterministic random, so the layout is identical on every visit.
  function makeRng(seed) {
    return () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  }

  function fitCanvas(canvas) {
    if (!canvas) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (w < 2 || h < 2) return null;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  const css = getComputedStyle(document.documentElement);
  const accent = hex(css.getPropertyValue('--accent'), [201, 182, 255]);
  const bio = hex(css.getPropertyValue('--bio'), [143, 227, 168]);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const frameHooks = [], scrollHooks = [], resizeHooks = [];

  const Atmos = window.Atmos = {
    clamp01, rgba, mix, hex, makeRng, fitCanvas,
    accent, bio, reduced,
    scrollY: window.scrollY || 0,
    onFrame: (fn) => frameHooks.push(fn),
    onScroll: (fn) => scrollHooks.push(fn),
    onResize: (fn) => resizeHooks.push(fn),
    requestDraw
  };

  const canvas = document.querySelector('[data-atmosphere]');
  const head = document.querySelector('[data-parallax="head"]');
  const veg = document.querySelector('[data-parallax="veg"]');
  const density = canvas
    ? Math.max(0, Math.min(2.2, parseFloat(canvas.dataset.density || '100') / 100))
    : 0;

  let B = null, dust = [], mist = [], glints = [], builtW = 0, builtH = 0;

  function build() {
    if (!B) return;
    const rnd = makeRng(20260913);
    const { w, h } = B;

    const n = Math.round(Math.min(260, (w * h) / 9000) * density);
    dust = [];
    for (let i = 0; i < n; i++) {
      const layer = i % 3;
      dust.push({
        x: rnd() * w, y: rnd() * h, layer,
        r: 0.5 + rnd() * (0.8 + layer * 0.7),
        sp: 3 + rnd() * 14, sw: 6 + rnd() * 22,
        ph: rnd() * 6.28, a: 0.18 + rnd() * 0.55
      });
    }

    mist = [];
    for (let i = 0; i < 7; i++) {
      mist.push({
        x: rnd() * w, y: h * (0.3 + rnd() * 0.7),
        rx: w * (0.22 + rnd() * 0.3), ry: h * (0.1 + rnd() * 0.16),
        ph: rnd() * 6.28, sp: 0.04 + rnd() * 0.09,
        a: 0.05 + rnd() * 0.07, tint: rnd()
      });
    }

    glints = [];
    const gn = Math.round(46 * density);
    for (let i = 0; i < gn; i++) {
      glints.push({ x: rnd() * w, y: h * (0.58 + rnd() * 0.42), ph: rnd() * 6.28, rate: 0.5 + rnd() * 2.1, r: 0.7 + rnd() * 1.6 });
    }
    builtW = w; builtH = h;
  }

  function drawBg(t, dt) {
    if (!B) return;
    const { ctx, w, h } = B;
    const scrollY = Atmos.scrollY;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    for (const m of mist) {
      const x = m.x + Math.sin(t * m.sp + m.ph) * w * 0.06;
      const y = m.y + Math.cos(t * m.sp * 0.7 + m.ph) * h * 0.02;
      const c = mix(bio, accent, m.tint);
      const rad = Math.max(m.rx, m.ry);
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, rgba(c, m.a * (0.7 + 0.3 * Math.sin(t * 0.4 + m.ph))));
      g.addColorStop(1, rgba(c, 0));
      ctx.save();
      ctx.translate(x, y); ctx.scale(1, m.ry / Math.max(1, m.rx)); ctx.translate(-x, -y);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.284); ctx.fill();
      ctx.restore();
    }

    for (const d of dust) {
      d.y -= d.sp * dt;
      if (d.y < -12) { d.y = h + 12; d.x = Math.random() * w; }
      const par = scrollY * (0.05 + d.layer * 0.07);
      const y = ((d.y + par) % (h + 24) + h + 24) % (h + 24) - 12;
      const x = d.x + Math.sin(t * 0.5 + d.ph) * d.sw;
      const c = mix([234, 240, 245], accent, 0.35 + d.layer * 0.2);
      ctx.fillStyle = rgba(c, d.a * (0.55 + 0.45 * Math.sin(t * 1.3 + d.ph)));
      ctx.beginPath(); ctx.arc(x, y, d.r, 0, 6.284); ctx.fill();
    }

    // Glints only near the top of the page (over the hero's forest floor).
    const band = 1 - Math.min(1, scrollY / Math.max(1, h));
    if (band > 0) {
      for (const g of glints) {
        const s = Math.pow(Math.max(0, Math.sin(t * g.rate + g.ph)), 8) * band;
        if (s < 0.01) continue;
        const y = g.y - scrollY * 0.18;
        if (y < -20) continue;
        const rg = ctx.createRadialGradient(g.x, y, 0, g.x, y, g.r * 7);
        rg.addColorStop(0, rgba([255, 255, 255], 0.9 * s));
        rg.addColorStop(0.35, rgba(bio, 0.45 * s));
        rg.addColorStop(1, rgba(bio, 0));
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(g.x, y, g.r * 7, 0, 6.284); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function resize() {
    if (canvas) {
      B = fitCanvas(canvas);
      // Mobile URL bars change height constantly: only rebuild on real layout changes.
      if (B && (B.w !== builtW || Math.abs(B.h - builtH) > 160)) build();
    }
    resizeHooks.forEach((fn) => fn());
    onScroll();
    requestDraw();
  }

  function onScroll() {
    Atmos.scrollY = window.scrollY || 0;
    const hp = clamp01(Atmos.scrollY / window.innerHeight);
    if (head) {
      head.style.transform = 'translate3d(0,' + (-hp * 110) + 'px,0)';
      head.style.opacity = String(clamp01(1 - hp * 1.7));
    }
    if (veg) veg.style.transform = 'translate3d(0,' + (hp * 54) + 'px,0) scale(' + (1 + hp * 0.06) + ')';
    scrollHooks.forEach((fn) => fn());
    requestDraw();
  }

  const t0 = performance.now();
  let last = t0, drawQueued = false;

  function frame(now) {
    const t = (now - t0) / 1000;
    const dt = reduced ? 0 : Math.min(0.05, (now - last) / 1000);
    last = now;
    drawBg(t, dt);
    frameHooks.forEach((fn) => fn(t, dt));
    if (!reduced) requestAnimationFrame(frame);
  }

  // With reduced motion there is no loop: redraw once per scroll/resize instead.
  function requestDraw() {
    if (!reduced || drawQueued) return;
    drawQueued = true;
    requestAnimationFrame((now) => { drawQueued = false; frame(now); });
  }

  window.addEventListener('resize', resize);
  window.addEventListener('scroll', onScroll, { passive: true });
  if (canvas && 'ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);

  resize();
  if (!reduced) requestAnimationFrame(frame);
})();
