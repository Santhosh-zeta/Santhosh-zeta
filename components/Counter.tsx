"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up once when scrolled into view. Server-renders the final number (works without JS). */
export default function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1400;
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <span ref={ref}>{n}{suffix}</span>;
}
