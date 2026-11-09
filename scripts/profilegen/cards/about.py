"""About: key/value manifest on the left, a pull-quote on the right."""
from __future__ import annotations

from ..svg import delay, document, esc, frame, n, ticks, truncate
from ..theme import Theme

W = 900
ROW = 46
TOP = 62


def _quote_lines(q: str, cols: int = 15):
    words, lines, cur = q.split(), [], ""
    for w in words:
        if len(f"{cur} {w}".strip()) <= cols:
            cur = f"{cur} {w}".strip()
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def render(ctx, t: Theme) -> str:
    cfg = ctx.config
    rows = cfg.about_rows
    H = TOP + ROW * len(rows) + 30
    H = max(H, 300)
    body = [frame(W, H, t), ticks(W, H, t)]
    body.append(f'<text x="48" y="40" font-size="11" letter-spacing="3" fill="{t.dim}">MANIFEST</text>')
    for i, (k, v) in enumerate(rows):
        y = TOP + 14 + i * ROW
        body.append(
            f'<g class="rise" {delay(0.08 * i)}>'
            f'<path d="M48 {y + 12}H560" stroke="{t.line_soft if i < len(rows) - 1 else t.line_soft}"/>'
            f'<text x="48" y="{y + 1}" font-size="11" letter-spacing="2.2" fill="{t.dim}">{esc(k.upper())}</text>'
            f'<text x="190" y="{y + 1}" font-size="14" fill="{t.fg}">{esc(truncate(v, 14, 370))}</text></g>'
        )
    # divider + quote
    body.append(f'<path d="M610 44V{H - 44}" stroke="{t.line}"/>')
    body.append(f'<text x="642" y="62" font-size="11" letter-spacing="3" fill="{t.dim}">PRINCIPLE</text>')
    qy = 138
    for i, ln in enumerate(_quote_lines(cfg.quote)):
        body.append(f'<text class="sans rise" {delay(0.3 + 0.12 * i)} x="642" y="{qy + i * 40}" font-size="31" font-weight="300" fill="{t.fg}">{esc(ln)}</text>')
    body.append(f'<path d="M642 {H - 60}H692" stroke="{t.fg}" stroke-width="1.5"/>')
    body.append(f'<text x="642" y="{H - 36}" font-size="11" letter-spacing="2.4" fill="{t.dim}">{esc(cfg.name.upper())}</text>')
    return document(W, H, "".join(body), title="About", desc="; ".join(f"{k}: {v}" for k, v in rows) + f". “{cfg.quote}”")
