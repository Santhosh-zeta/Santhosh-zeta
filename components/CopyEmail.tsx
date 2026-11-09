"use client";

import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="btn ghost"
      style={{ background: "transparent", color: "inherit", cursor: "pointer" }}
      onClick={async () => {
        try { await navigator.clipboard.writeText(email); setDone(true); setTimeout(() => setDone(false), 1800); } catch {}
      }}
      aria-live="polite"
    >
      {done ? "Copied ✓" : "Copy email"}
    </button>
  );
}
