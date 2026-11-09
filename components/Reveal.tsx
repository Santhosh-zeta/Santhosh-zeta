"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** Fades content in once when it scrolls into view. Content stays visible if JS is off. */
export default function Reveal({ children, delay = 0, as: Tag = "div", className = "" }: {
  children: ReactNode; delay?: number; as?: "div" | "li" | "article"; className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Comp = Tag as "div";
  return (
    <Comp ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${className}`} style={{ "--d": `${delay}s` } as CSSProperties}>
      {children}
    </Comp>
  );
}
