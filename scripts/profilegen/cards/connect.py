"""Closing card: one line of intent and a halftone ramp."""
from __future__ import annotations

import math

from ..svg import delay, document, esc, frame, n, ticks
from ..theme import Theme

W, H = 900, 220


def render(ctx, t: Theme) -> str:
    cfg = ctx.config
    dots = []
    cols, rows, pitch, x0, y0 = 22, 10, 11, 600, 40
    for c in range(cols):
        for r in range(rows):
            k = c / (cols - 1)
            wave = 0.5 + 0.5 * math.sin(r * 0.9 + c * 0.35)
            rad = 0.4 + 4.2 * (k ** 1.4) * (0.35 + 0.65 * wave)
            if rad < 0.5:
                continue
            dots.append(f'<circle cx="{n(x0 + c * pitch)}" cy="{n(y0 + r * pitch + (pitch / 2 if c % 2 else 0))}" r="{n(round(rad, 2))}"/>')
    body = (
        frame(W, H, t) + ticks(W, H, t)
        + f'<g fill="{t.fg}" class="fade" {delay(.3)}>{"".join(dots)}</g>'
        + f'<text x="48" y="50" font-size="11" letter-spacing="3" fill="{t.dim}">CONTACT</text>'
        + f'<text class="sans rise" x="46" y="112" font-size="46" font-weight="200" fill="{t.fg}">Let’s build</text>'
        + f'<text class="sans rise" {delay(.15)} x="46" y="160" font-size="46" font-weight="200" fill="{t.fg}">something.</text>'
        + f'<text x="48" y="194" font-size="12.5" letter-spacing="1" fill="{t.muted}">{esc(cfg.links.get("email", ""))}</text>'
    )
    return document(W, H, body, title="Contact", desc=f"Let's build something. {cfg.links.get('email', '')}")
