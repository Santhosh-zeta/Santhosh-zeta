"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type Cmd = { id: string; label: string; hint: string; group: string; href?: string; external?: boolean; action?: "theme" | "copy-email"; email?: string };

/** ⌘K / Ctrl+K command palette: jump anywhere, open links, toggle theme, copy email. */
export default function CommandPalette({ items }: { items: Cmd[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [toast, setToast] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((i) => `${i.label} ${i.hint} ${i.group}`.toLowerCase().includes(t));
  }, [items, q]);

  const close = useCallback(() => { setOpen(false); setQ(""); setSel(0); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === "Escape") close();
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("open-palette", onOpen); };
  }, [close]);

  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; setTimeout(() => input.current?.focus(), 10); }
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => setSel(0), [q]);

  const run = (c: Cmd) => {
    close();
    if (c.action === "theme") {
      const d = document.documentElement;
      const next = d.getAttribute("data-theme") === "light" ? "dark" : "light";
      d.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch {}
    } else if (c.action === "copy-email" && c.email) {
      navigator.clipboard?.writeText(c.email).then(() => { setToast("Email copied"); setTimeout(() => setToast(""), 1800); }).catch(() => {});
    } else if (c.href) {
      if (c.external) window.open(c.href, "_blank", "noopener");
      else if (c.href.startsWith("/#")) { router.push(c.href); }
      else router.push(c.href);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, list.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter" && list[sel]) { e.preventDefault(); run(list[sel]); }
  };

  let lastGroup = "";
  return (
    <>
      {toast && <div className="toast" role="status">{toast}</div>}
      {open && (
        <div className="pal-back" onMouseDown={close}>
          <div className="pal" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
            <input ref={input} className="pal-in" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sections, projects, links…" aria-label="Search" />
            <ul className="pal-list" role="listbox">
              {list.length === 0 && <li className="pal-empty">No results</li>}
              {list.map((c, i) => {
                const head = c.group !== lastGroup ? (lastGroup = c.group) : null;
                return (
                  <li key={c.id} role="presentation">
                    {head && <p className="pal-group label">{head}</p>}
                    <button role="option" aria-selected={i === sel} className={`pal-item${i === sel ? " on" : ""}`} onMouseEnter={() => setSel(i)} onClick={() => run(c)}>
                      <span>{c.label}</span><span className="pal-hint">{c.hint}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="pal-foot label">↑↓ navigate · ↵ open · esc close</p>
          </div>
        </div>
      )}
    </>
  );
}
