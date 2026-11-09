"""Tiny SVG helpers shared by every card."""
from __future__ import annotations

from typing import Iterable, List
from xml.sax.saxutils import escape

from .theme import Theme

MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono','DejaVu Sans Mono',monospace"
SANS = "'Helvetica Neue',Helvetica,Arial,'Liberation Sans','Segoe UI',sans-serif"
CHAR = 0.6  # monospace advance width as a fraction of font size


def esc(s: str) -> str:
    return escape(str(s), {'"': "&quot;"})


def n(v: float) -> str:
    """Compact number: at most 2 decimals, no trailing zeros."""
    if isinstance(v, int):
        return str(v)
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def mono_width(text: str, size: float) -> float:
    return len(text) * size * CHAR


def wrap(text: str, size: float, max_width: float, max_lines: int) -> List[str]:
    """Greedy word wrap for monospace text, ellipsising the last line on overflow."""
    cols = max(1, int(max_width // (size * CHAR)))
    lines: List[str] = []
    line = ""
    for word in text.split():
        while len(word) > cols:  # hard-split absurdly long tokens
            if line:
                lines.append(line)
                line = ""
            lines.append(word[:cols])
            word = word[cols:]
        trial = f"{line} {word}".strip()
        if len(trial) <= cols:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        last = lines[-1]
        lines[-1] = (last[: cols - 1].rstrip() + "…") if len(last) >= cols else last + "…"
    return lines


def truncate(text: str, size: float, max_width: float) -> str:
    cols = max(1, int(max_width // (size * CHAR)))
    return text if len(text) <= cols else text[: cols - 1].rstrip() + "…"


BASE_CSS = f"""
text{{font-family:{MONO}}}
.sans{{font-family:{SANS}}}
@keyframes fade{{from{{opacity:0}}to{{opacity:1}}}}
@keyframes rise{{from{{opacity:0;transform:translateY(6px)}}to{{opacity:1;transform:none}}}}
@keyframes blink{{0%,49%{{opacity:1}}50%,100%{{opacity:0}}}}
@keyframes draw{{from{{stroke-dashoffset:var(--len)}}to{{stroke-dashoffset:0}}}}
.fade{{animation:fade .8s ease-out both}}
.rise{{animation:rise .8s cubic-bezier(.2,.7,.2,1) both}}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important}}}}
"""


def document(w: float, h: float, body: str, *, title: str, desc: str = "", css: str = "", defs: str = "") -> str:
    """Standalone, accessible SVG. Resting (un-animated) style must be the final visible state."""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{n(w)}" height="{n(h)}" viewBox="0 0 {n(w)} {n(h)}" '
        f'role="img" aria-labelledby="t d" fill="none">'
        f'<title id="t">{esc(title)}</title><desc id="d">{esc(desc or title)}</desc>'
        f"<style>{BASE_CSS}{css}</style>"
        f"{('<defs>' + defs + '</defs>') if defs else ''}{body}</svg>\n"
    )


def frame(w: float, h: float, t: Theme) -> str:
    return f'<rect x=".5" y=".5" width="{n(w - 1)}" height="{n(h - 1)}" fill="{t.bg}" stroke="{t.line}"/>'


def ticks(w: float, h: float, t: Theme, inset: float = 12, size: float = 8) -> str:
    """Registration marks in the four corners."""
    a, b = inset, inset + size
    parts = []
    for x, y, dx, dy in ((a, a, 1, 1), (w - a, a, -1, 1), (a, h - a, 1, -1), (w - a, h - a, -1, -1)):
        parts.append(f"M{n(x)} {n(y + dy * size)}V{n(y)}H{n(x + dx * size)}")
    return f'<path d="{"".join(parts)}" stroke="{t.dim}" stroke-width="1"/>'


def delay(sec: float) -> str:
    return f'style="animation-delay:{sec:.2f}s"'


def fmt_int(v: int) -> str:
    return f"{v:,}"


def fmt_compact(v: int) -> str:
    if v >= 1_000_000:
        return f"{v / 1_000_000:.1f}".rstrip("0").rstrip(".") + "M"
    if v >= 100_000:
        return f"{v // 1000}k"
    if v >= 10_000:
        return f"{v / 1000:.1f}".rstrip("0").rstrip(".") + "k"
    return fmt_int(v)


def join(parts: Iterable[str]) -> str:
    return "".join(parts)
