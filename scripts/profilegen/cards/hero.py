"""Hero: a halftone sphere with rippling rings, orbit lines and a typed tagline."""
from __future__ import annotations

import math
from collections import defaultdict

from ..svg import CHAR, MONO, SANS, delay, document, esc, frame, n, ticks
from ..theme import Theme

W, H = 900, 380
CX, CY, R, PITCH = 684, 192, 128, 7.0
SLOT = 4.2  # seconds each tagline stays on screen
TYPE_FRACTION = 0.34
FS = 19


def _sphere(t: Theme) -> str:
    lx, ly, lz = -0.55, -0.62, 0.56
    norm = math.sqrt(lx * lx + ly * ly + lz * lz)
    lx, ly, lz = lx / norm, ly / norm, lz / norm
    bands = defaultdict(list)
    y, row = CY - R, 0
    while y <= CY + R:
        x = CX - R + (PITCH / 2 if row % 2 else 0)
        while x <= CX + R:
            nx, ny = (x - CX) / R, (y - CY) / R
            d2 = nx * nx + ny * ny
            if d2 <= 1.0:
                nz = math.sqrt(1 - d2)
                b = max(0.0, nx * lx + ny * ly + nz * lz)
                if t.invert:
                    b = 1 - b
                r = PITCH * 0.5 * (0.14 + 0.86 * b ** 1.1)
                if r >= 0.42:
                    bands[int(math.sqrt(d2) * 10)].append(f'<circle cx="{n(round(x, 1))}" cy="{n(round(y, 1))}" r="{n(round(r, 2))}"/>')
            x += PITCH
        y += PITCH * 0.866
        row += 1
    out = []
    for idx in sorted(bands):
        out.append(f'<g class="rp" fill="{t.fg}" {delay((10 - idx) * 0.16)}>{"".join(bands[idx])}</g>')
    return "".join(out)


def _orbits(t: Theme) -> str:
    def ring(rx, ry, rot, dash, dur, rev=False):
        path = f"M{n(CX - rx)} {n(CY)}a{rx} {ry} 0 1 {0 if not rev else 1} {2 * rx} 0a{rx} {ry} 0 1 {0 if not rev else 1} {-2 * rx} 0"
        return (
            f'<g transform="rotate({rot} {CX} {CY})">'
            f'<ellipse cx="{CX}" cy="{CY}" rx="{rx}" ry="{ry}" stroke="{t.faint}" stroke-width="1"{dash}/>'
            f'<circle r="3" fill="{t.fg}"><animateMotion dur="{dur}s" repeatCount="indefinite" path="{path}"/></circle>'
            f"</g>"
        )
    return ring(166, 40, -22, ' stroke-dasharray="2 5"', 15) + ring(198, 66, 16, "", 23, True)


def _typed(cfg, t: Theme):
    lines = cfg.typing_lines
    cnt = len(lines)
    css, svg = [], []
    x0, y = 70, 286
    cw = FS * CHAR
    cycle = SLOT * cnt
    slot_pct = 100 / cnt
    for i, text in enumerate(lines):
        wpx = len(text) * cw
        s = i * slot_pct
        typed_end = s + slot_pct * TYPE_FRACTION
        hold_end = s + slot_pct - 1.2
        vis = f"@keyframes v{i}{{" + ("0%{opacity:1}" if i == 0 else f"0%,{n(s)}%{{opacity:0}}{n(s + 0.01)}%{{opacity:1}}")
        vis += f"{n(hold_end)}%{{opacity:1}}{n(hold_end + 1.1)}%,100%{{opacity:0}}}}"
        cov = f"@keyframes c{i}{{0%,{n(s)}%{{transform:scaleX(1)}}{n(typed_end)}%,100%{{transform:scaleX(0)}}}}"
        car = f"@keyframes k{i}{{0%,{n(s)}%{{transform:translateX(0)}}{n(typed_end)}%,100%{{transform:translateX({n(wpx)}px)}}}}"
        css += [vis, cov, car,
                f".v{i}{{animation:v{i} {cycle}s linear infinite{'' if i else ''}}}"
                f".c{i}{{transform-box:fill-box;transform-origin:right center;transform:scaleX(0);"
                f"animation:c{i} {cycle}s steps({len(text)},end) infinite}}"
                f".k{i}{{animation:k{i} {cycle}s steps({len(text)},end) infinite}}"]
        svg.append(
            f'<g class="v{i} ln" style="opacity:{1 if i == 0 else 0}">'
            f'<text x="{x0}" y="{y}" font-size="{FS}" fill="{t.fg}" textLength="{n(wpx)}" lengthAdjust="spacingAndGlyphs">{esc(text)}</text>'
            f'<rect class="c{i}" x="{x0 - 1}" y="{y - FS}" width="{n(wpx + 3)}" height="{FS + 8}" fill="{t.bg}"/>'
            f'<rect class="k{i}" x="{x0}" y="{y - FS + 2}" width="2" height="{FS}" fill="{t.fg}"/>'
            f"</g>"
        )
    css.append("@media (prefers-reduced-motion:reduce){.ln:not(.v0){display:none}.c0,.k0{display:none}}")
    return "".join(css), "".join(svg)


def render(ctx, t: Theme) -> str:
    cfg = ctx.config
    typed_css, typed_svg = _typed(cfg, t)
    css = (
        ".rp{animation:rp 3.8s ease-in-out infinite}"
        "@keyframes rp{0%,100%{opacity:1}50%{opacity:.4}}"
        ".blink{animation:blink 1.6s steps(1) infinite}"
        ".sweep{animation:sweep 6s ease-in-out infinite}"
        "@keyframes sweep{0%,100%{transform:translateX(-340px)}55%{transform:translateX(560px)}}"
        + typed_css
    )
    defs = (
        f'<pattern id="amb" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r=".75" fill="{t.dim}"/></pattern>'
        f'<linearGradient id="fadeR" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset=".45" stop-color="#fff"/></linearGradient>'
        f'<mask id="ambm"><rect x="430" y="0" width="470" height="{H}" fill="url(#fadeR)"/></mask>'
        f'<linearGradient id="shine" x1="0" x2="1"><stop offset="0" stop-color="{t.fg}" stop-opacity="0"/>'
        f'<stop offset=".5" stop-color="{t.fg}" stop-opacity=".55"/><stop offset="1" stop-color="{t.fg}" stop-opacity="0"/></linearGradient>'
        f'<clipPath id="nameclip"><text x="48" y="178" font-size="72" font-weight="200" class="sans" textLength="430" lengthAdjust="spacingAndGlyphs">{esc(cfg.name.upper())}</text></clipPath>'
    )
    name = cfg.name.upper()
    roles = "   /   ".join(r.upper() for r in cfg.roles)
    body = (
        frame(W, H, t)
        + f'<rect x="430" y="0" width="470" height="{H}" fill="url(#amb)" mask="url(#ambm)" opacity=".7"/>'
        + f'<circle cx="{CX}" cy="{CY}" r="{R + 6}" stroke="{t.line}" stroke-width="1"/>'
        + _orbits(t) + _sphere(t)
        + ticks(W, H, t)
        # labels
        + f'<text x="48" y="54" font-size="11" letter-spacing="3" fill="{t.dim}">{esc(cfg.username.upper())}</text>'
        + f'<text x="852" y="54" font-size="11" letter-spacing="3" fill="{t.dim}" text-anchor="end">{esc(cfg.year_label)}</text>'
        # name
        + f'<text class="sans rise" x="48" y="178" font-size="72" font-weight="200" fill="{t.fg}" textLength="430" lengthAdjust="spacingAndGlyphs">{esc(name)}</text>'
        + f'<g clip-path="url(#nameclip)"><rect class="sweep" x="48" y="100" width="150" height="90" fill="url(#shine)" opacity=".9"/></g>'
        + f'<text x="50" y="212" font-size="12" letter-spacing="2.4" fill="{t.muted}" class="fade" {delay(.4)}>{esc(roles)}</text>'
        + f'<path d="M48 236H470" stroke="{t.line}"/><path d="M48 236H88" stroke="{t.fg}" stroke-width="1.5"/>'
        + f'<text x="48" y="{286}" font-size="{FS}" fill="{t.dim}">›</text>'
        + typed_svg
        # status
        + f'<circle class="blink" cx="52" cy="337" r="3.5" fill="{t.fg}"/>'
        + f'<text x="66" y="341" font-size="11" letter-spacing="2.4" fill="{t.muted}">{esc(cfg.status.upper())}</text>'
    )
    return document(W, H, body, title=f"{cfg.name} — profile", desc=f"{cfg.name}: {', '.join(cfg.roles)}", css=css, defs=defs)
