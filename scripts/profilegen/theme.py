def wrap(s: str, max_width: float, size: float, *, weight: int = 400, max_lines: int = 0) -> List[str]:
    words, lines, line = s.split(), [], ""
    for word in words:
        trial = f"{line} {word}".strip()
        if text_width(trial, size, weight=weight) <= max_width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    lines = [truncate(ln, max_width, size, weight=weight) for ln in lines]
    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        lines[-1] = truncate(lines[-1] + " …", max_width, size, weight=weight)
        if not lines[-1].endswith("…"):
            lines[-1] = lines[-1].rstrip() + "…"
    return lines


# ------------------------------------------------------------- SVG building

BASE_CSS = f"""
text{{font-family:{SANS}}}
.mono{{font-family:{MONO}}}
@keyframes pg-fade{{from{{opacity:0}}to{{opacity:1}}}}
@keyframes pg-rise{{from{{opacity:0;transform:translateY(8px)}}to{{opacity:1;transform:none}}}}
.fade{{animation:pg-fade .7s ease-out both}}
.rise{{animation:pg-rise .7s cubic-bezier(.2,.7,.2,1) both}}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important;transition:none!important}}}}
"""


def document(width: float, height: float, body: str, *, title: str, desc: str = "", css: str = "") -> str:
    """Wrap card markup in a standalone, accessible SVG document.

    Always use this so every card shares fonts, keyframes and the reduced-motion rule.
    Animations should be written so that the element's resting (non-animated) style
    is the final visible state; the keyframes' `from` does the hiding. That way
    `animation:none` under reduced motion shows everything.
    """
    w, h = _num(width), _num(height)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" '
        f'role="img" aria-labelledby="t d" fill="none">'
        f'<title id="t">{esc(title)}</title><desc id="d">{esc(desc or title)}</desc>'
        f"<style>{BASE_CSS}{css}</style>{body}</svg>\n"
    )


def frame(width: float, height: float, theme: Theme, *, radius: float = 14) -> str:
    """Standard card surface: 1px inset border so strokes stay crisp."""
    return (
        f'<rect x="0.5" y="0.5" width="{_num(width - 1)}" height="{_num(height - 1)}" rx="{_num(radius)}" '
        f'fill="{theme.bg}" stroke="{theme.border}"/>'
    )


def delay(seconds: float) -> str:
    return f'style="animation-delay:{seconds:.2f}s"'


def _num(v: float) -> str:
    return f"{v:.2f}".rstrip("0").rstrip(".") if isinstance(v, float) else str(v)


num = _num
