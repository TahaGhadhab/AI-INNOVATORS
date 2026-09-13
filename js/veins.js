/* =========================================================
   Theme story: as the visitor scrolls through [data-stage], the flower
   zooms in, its veins light up as a glowing network, data packets flow
   along them and the three captions cross-fade.
   Runs inside the atmosphere loop (js/atmosphere.js must load first).
   ========================================================= */
(function () {
  'use strict';

  const A = window.Atmos;
  const stage = document.querySelector('[data-stage]');
  const canvas = document.querySelector('[data-veins]');
  if (!A || !stage || !canvas) return;

  const flower = stage.querySelector('[data-flower]');
  const tint = stage.querySelector('[data-tint]');
  const caps = stage.querySelectorAll('[data-cap]');

  let V = null, veins = [], nodes = [], tips = [], sparks = [], center = null;
  let p = 0, visible = false, cleared = true;

  function build() {
    if (!V) return;
    const rnd = A.makeRng(20260913);
    const { w, h } = V;
    const cx = w / 2, cy = h / 2, R = Math.min(w, h);
    veins = []; nodes = []; tips = []; sparks = [];

    const grow = (x, y, ang, len, width, depth) => {
      const pts = [{ x, y }];
      const steps = 16;
      let a = ang;
      for (let i = 0; i < steps; i++) {
        a += (rnd() - 0.5) * 0.32;
        x += Math.cos(a) * (len / steps);
        y += Math.sin(a) * (len / steps);
        pts.push({ x, y });
      }
      let total = 0;
      const cum = [0];
      for (let i = 1; i < pts.length; i++) {
        total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        cum.push(total);
      }
      veins.push({ pts, cum, total, width, off: rnd(), sp: 0.1 + rnd() * 0.16 });
      tips.push(pts[pts.length - 1]);
      if (depth > 0) nodes.push({ x: pts[0].x, y: pts[0].y, s: 1.6 + rnd() * 1.8 });
      if (depth < 2) {
        const forks = depth === 0 ? 2 : 1;
        for (let f = 0; f < forks; f++) {
          const i = Math.floor(pts.length * (0.35 + 0.3 * f + rnd() * 0.2));
          const b = pts[Math.min(i, pts.length - 1)];
          grow(b.x, b.y, a + (rnd() < 0.5 ? -1 : 1) * (0.5 + rnd() * 0.5), len * (0.42 + rnd() * 0.2), width * 0.55, depth + 1);
        }
      }
    };

    const spokes = 15;
    for (let i = 0; i < spokes; i++) {
      const ang = (i / spokes) * Math.PI * 2 + rnd() * 0.24;
      const r0 = R * 0.07;
      grow(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0, ang, R * (0.4 + rnd() * 0.3), 2.2, 0);
    }
    center = { cx, cy, R };
  }

  function pointAt(v, len) {
    const c = v.cum;
    for (let i = 1; i < c.length; i++) {
      if (c[i] >= len) {
        const t = (len - c[i - 1]) / Math.max(1e-3, c[i] - c[i - 1]);
        return { x: v.pts[i - 1].x + (v.pts[i].x - v.pts[i - 1].x) * t, y: v.pts[i - 1].y + (v.pts[i].y - v.pts[i - 1].y) * t };
      }
    }
    return v.pts[v.pts.length - 1];
  }

  function resize() {
    V = A.fitCanvas(canvas);
    build();
    cleared = true;
  }

  function layout() {
    const vh = window.innerHeight;
    const r = stage.getBoundingClientRect();
    visible = r.bottom > 0 && r.top < vh;
    p = A.clamp01(-r.top / Math.max(1, r.height - vh));
    if (!visible) return;

    if (flower) {
      flower.style.transform = 'scale(' + (1 + p * 0.42) + ')';
      flower.style.filter = 'brightness(' + (1 - 0.2 * p) + ') contrast(' + (1 + 0.1 * p) + ')';
    }
    if (tint) tint.style.opacity = String(A.clamp01((p - 0.5) / 0.45) * 0.34);
    const seg = (a, b) => A.clamp01((p - a) / (b - a));
    const ops = [
      A.clamp01(1 - seg(0.3, 0.44)),
      A.clamp01(seg(0.42, 0.56) - seg(0.74, 0.86)),
      seg(0.8, 0.92)
    ];
    caps.forEach((cap, i) => { cap.style.opacity = String(ops[i] ?? 0); });
  }

  function draw(t, dt) {
    if (!V || !center) return;
    const { ctx, w, h } = V;
    if (!visible || p <= 0.001) {
      if (!cleared) { ctx.clearRect(0, 0, w, h); cleared = true; }
      return;
    }
    cleared = false;
    ctx.clearRect(0, 0, w, h);

    const { accent: ac, bio: bi, rgba, mix } = A;
    const { cx, cy, R } = center;
    const col = mix(bi, ac, Math.min(1, p * 1.25));
    ctx.globalCompositeOperation = 'lighter';

    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.6);
    core.addColorStop(0, rgba(col, 0.24 * p));
    core.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.6, 0, 6.284); ctx.fill();

    const reveal = Math.min(1, 0.25 + p * 1.1);
    ctx.lineCap = 'round';
    for (const v of veins) {
      const breathe = 0.75 + 0.25 * Math.sin(t * 0.8 + v.off * 6.28);
      const n = Math.max(2, Math.floor(v.pts.length * reveal));

      ctx.strokeStyle = rgba(col, 0.1 * p * breathe);
      ctx.lineWidth = v.width * 3.2;
      ctx.beginPath(); ctx.moveTo(v.pts[0].x, v.pts[0].y);
      for (let i = 1; i < n; i++) ctx.lineTo(v.pts[i].x, v.pts[i].y);
      ctx.stroke();

      ctx.strokeStyle = rgba(mix(col, [255, 255, 255], 0.3), (0.2 + 0.45 * p) * breathe);
      ctx.lineWidth = v.width * 0.9;
      ctx.beginPath(); ctx.moveTo(v.pts[0].x, v.pts[0].y);
      for (let i = 1; i < n; i++) ctx.lineTo(v.pts[i].x, v.pts[i].y);
      ctx.stroke();

      // Data packets travelling along the vein
      const packets = Math.floor(p * 3.4);
      for (let k = 0; k < packets; k++) {
        const u = (t * v.sp + v.off + k / Math.max(1, packets)) % 1;
        const pt = pointAt(v, u * v.total * reveal);
        const fade = Math.sin(u * Math.PI);
        const rad = (2.4 + v.width) * (0.6 + 0.4 * fade);
        const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, rad * 5);
        g.addColorStop(0, rgba([255, 255, 255], 0.95 * fade * p));
        g.addColorStop(0.3, rgba(ac, 0.55 * fade * p));
        g.addColorStop(1, rgba(ac, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, rad * 5, 0, 6.284); ctx.fill();
      }
    }

    // Expanding pulse rings that light up the branch nodes
    const rr0 = ((t * 0.2) % 1) * R * 1.15, rr1 = ((t * 0.2 + 0.5) % 1) * R * 1.15;
    if (p > 0.12) {
      ctx.globalCompositeOperation = 'source-atop';
      const band = R * 0.09;
      for (const rr of [rr0, rr1]) {
        const g = ctx.createRadialGradient(cx, cy, Math.max(0, rr - band), cx, cy, rr + band);
        g.addColorStop(0, rgba(col, 0));
        g.addColorStop(0.5, rgba(mix(col, [255, 255, 255], 0.55), 0.45 * p));
        g.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = 'lighter';
      for (const nd of nodes) {
        const d = Math.hypot(nd.x - cx, nd.y - cy);
        const near = Math.max(0, 1 - Math.min(Math.abs(d - rr0), Math.abs(d - rr1)) / (R * 0.07));
        const a = (0.1 + 0.85 * near) * p;
        if (a < 0.02) continue;
        const s = nd.s * (1 + near);
        ctx.fillStyle = rgba(mix(col, [255, 255, 255], 0.5), a);
        ctx.save(); ctx.translate(nd.x, nd.y); ctx.rotate(0.785);
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      }
    }

    // Sparks escaping from the vein tips (skipped when motion is reduced)
    if (dt > 0) {
      if (p > 0.4 && tips.length && sparks.length < 70 && Math.random() < p * 0.6) {
        const tp = tips[(Math.random() * tips.length) | 0];
        const a = Math.atan2(tp.y - cy, tp.x - cx) + (Math.random() - 0.5) * 0.9;
        const sp = 14 + Math.random() * 42;
        sparks.push({ x: tp.x, y: tp.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 8, life: 0, max: 1 + Math.random() * 1.4 });
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy -= 4 * dt;
        if (s.life > s.max) { sparks.splice(i, 1); continue; }
        const f = Math.sin((s.life / s.max) * Math.PI);
        ctx.fillStyle = rgba(mix(col, [255, 255, 255], 0.6), 0.7 * f * p);
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.1 + f, 0, 6.284); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  A.onResize(resize);
  A.onScroll(layout);
  A.onFrame(draw);
  resize();
  layout();
  A.requestDraw();
})();
