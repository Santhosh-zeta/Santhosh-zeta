"""Stack: typographic chips grouped by discipline (no logos, no colour)."""
from __future__ import annotations

from ..svg import CHAR, delay, document, esc, frame, n, ticks
from ..theme import Theme

W = 900
LABEL_X, CHIP_X0, CHIP_X1 = 48, 250, 852
CHIP_H, GAP, FS = 30, 10, 12.5
PAD_X = 14


def _layout(items):
    rows, cur, x = [], [], CHIP_X0
    for it in items:
        w = len(it) * FS * CHAR + PAD_X * 2
        if x + w > CHIP_X1 and cur:
            rows.append(cur)
            cur, x = [], CHIP_X0
        cur.append((it, x, w))
        x += w + GAP
    if cur:
        rows.append(cur)
    return rows


def render(ctx, t: Theme) -> str:
    groups = ctx.config.stack
    y = 54
    parts, count = [], 0
    for gi, (label, items) in enumerate(groups):
        rows = _layout(items)
        h = len(rows) * (CHIP_H + GAP) - GAP
        parts.append(f'<text x="{LABEL_X}" y="{y + 19}" font-size="11" letter-spacing="2.2" fill="{t.dim}">{gi + 1:02d}</text>')
        parts.append(f'<text class="sans" x="{LABEL_X + 34}" y="{y + 20}" font-size="15" font-weight="300" letter-spacing="1.5" fill="{t.fg}">{esc(label)}</text>')
        for ri, row in enumerate(rows):
            for it, x, w in row:
                cy = y + ri * (CHIP_H + GAP)
                parts.append(
                    f'<g class="rise" {delay(0.05 * count)}>'
                    f'<rect x="{n(x)}" y="{cy}" width="{n(w)}" height="{CHIP_H}" fill="{t.panel}" stroke="{t.line}"/>'
                    f'<text x="{n(x + w / 2)}" y="{cy + 19.5}" font-size="{FS}" fill="{t.fg}" text-anchor="middle">{esc(it)}</text></g>'
                )
                count += 1
        y += h + 26
        if gi < len(groups) - 1:
            parts.append(f'<path d="M48 {y - 13}H852" stroke="{t.line_soft}"/>')
    H = y + 24
    parts.insert(0, frame(W, H, t) + ticks(W, H, t))
    return document(W, H, "".join(parts), title="Tech stack", desc="; ".join(f"{l}: {', '.join(i)}" for l, i in groups))
