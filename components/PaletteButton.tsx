"use client";

export default function PaletteButton() {
  return (
    <button className="kbd-btn" onClick={() => window.dispatchEvent(new Event("open-palette"))} aria-label="Open command palette">
      <span>Search</span><kbd>⌘K</kbd>
    </button>
  );
}
