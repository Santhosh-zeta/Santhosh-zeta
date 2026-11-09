"use client";

import { useEffect, useState } from "react";

/** Typewriter that cycles through lines. Server-renders the first line in full (works without JS). */
export default function Typed({ lines }: { lines: readonly string[] }) {
  const [text, setText] = useState(lines[0]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setLive(true);
    let i = 0, n = 0, dir = 1, timer: ReturnType<typeof setTimeout>;
    n = 0; setText("");
    const tick = () => {
      const line = lines[i];
      if (dir === 1) {
        n++;
        setText(line.slice(0, n));
        if (n === line.length) { dir = -1; timer = setTimeout(tick, 1900); return; }
        timer = setTimeout(tick, 55 + Math.random() * 45);
      } else {
        n--;
        setText(line.slice(0, n));
        if (n === 0) { dir = 1; i = (i + 1) % lines.length; timer = setTimeout(tick, 350); return; }
        timer = setTimeout(tick, 22);
      }
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [lines]);

  return (
    <p className="typed" aria-label={lines.join(". ")}>
      <span className="prompt" aria-hidden="true">›</span>
      <span aria-hidden="true">{text}{live && <i className="caret" />}</span>
    </p>
  );
}
