"use client";

import { useEffect, useRef } from "react";

/**
 * Halftone planet drawn on <canvas>. The light source drifts on its own and follows the pointer,
 * and a ripple travels outward through the dots. Reads colours from the CSS tokens, so it follows
 * the theme. Respects prefers-reduced-motion (draws one still frame) and pauses when off-screen.
 */
export default function Planet() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let size = 0, dpr = 1, raf = 0, visible = true, running = false;
    let fg = "#fff", faint = "#444", invert = false;
    const light = { x: -0.55, y: -0.6, tx: -0.55, ty: -0.6 };
    let pointer = false;

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      fg = cs.getPropertyValue("--fg").trim() || "#fff";
      faint = cs.getPropertyValue("--dim").trim() || "#666";
      invert = (document.documentElement.getAttribute("data-theme") ?? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")) === "light";
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = r.width;
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
    };

    const draw = (t: number) => {
      const s = size, c = s / 2, R = s * 0.31, pitch = Math.max(5.5, s / 80);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, s, s);

      if (!reduce && !pointer) {
        const a = t * 0.00022;
        light.tx = Math.cos(a) * 0.7;
        light.ty = Math.sin(a * 0.8 + 1) * 0.55 - 0.15;
      }
      light.x += (light.tx - light.x) * 0.06;
      light.y += (light.ty - light.y) * 0.06;
      const lz = 0.62;
      const ln = Math.hypot(light.x, light.y, lz);
      const lx = light.x / ln, ly = light.y / ln, lzn = lz / ln;

      // rings
      ctx.strokeStyle = faint; ctx.globalAlpha = 0.5; ctx.lineWidth = 1;
      const rings: [number, number, number, number][] = [[R * 1.38, R * 0.34, -0.38, 15000], [R * 1.66, R * 0.56, 0.28, -23000]];
      ctx.setLineDash([2, 5]);
      rings.forEach(([rx, ry, rot], i) => {
        ctx.save(); ctx.translate(c, c); ctx.rotate(rot);
        if (i === 1) ctx.setLineDash([]);
        ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      });
      ctx.setLineDash([]); ctx.globalAlpha = 1;

      // sphere outline
      ctx.beginPath(); ctx.arc(c, c, R + 7, 0, Math.PI * 2); ctx.strokeStyle = faint; ctx.globalAlpha = 0.35; ctx.stroke(); ctx.globalAlpha = 1;

      // dots
      ctx.fillStyle = fg;
      const rowH = pitch * 0.866;
      let row = 0;
      for (let y = c - R; y <= c + R; y += rowH, row++) {
        for (let x = c - R + (row % 2 ? pitch / 2 : 0); x <= c + R; x += pitch) {
          const nx = (x - c) / R, ny = (y - c) / R, d2 = nx * nx + ny * ny;
          if (d2 > 1) continue;
          const nz = Math.sqrt(1 - d2);
          let b = Math.max(0, nx * lx + ny * ly + nz * lzn);
          if (invert) b = 1 - b;
          let r = pitch * 0.5 * (0.14 + 0.86 * Math.pow(b, 1.1));
          if (!reduce) r *= 1 + 0.16 * Math.sin(Math.sqrt(d2) * 7 - t * 0.0021);
          if (r < 0.42) continue;
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }
      }

      // orbiting satellites
      if (!reduce) {
        rings.forEach(([rx, ry, rot, period]) => {
          const a = (t / Math.abs(period)) * Math.PI * 2 * Math.sign(period);
          const px = Math.cos(a) * rx, py = Math.sin(a) * ry;
          const x = c + px * Math.cos(rot) - py * Math.sin(rot);
          const y = c + px * Math.sin(rot) + py * Math.cos(rot);
          ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill();
        });
      }
    };

    const loop = (t: number) => {
      if (!visible || document.hidden) { running = false; return; }
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!running && !reduce) { running = true; raf = requestAnimationFrame(loop); } };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      light.tx = Math.max(-1, Math.min(1, x)) * 0.9;
      light.ty = Math.max(-1, Math.min(1, y)) * 0.9;
      pointer = true;
      if (reduce) draw(0);
    };
    const onLeave = () => { pointer = false; };

    readTheme(); resize(); draw(0); start();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    io.observe(canvas);
    const mo = new MutationObserver(() => { readTheme(); if (reduce) draw(0); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
    ro.observe(canvas);
    const vis = () => { if (!document.hidden) start(); };
    document.addEventListener("visibilitychange", vis);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); mo.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
