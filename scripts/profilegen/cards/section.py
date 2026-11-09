"""Slim section header: index, label, drawn hairline."""
from __future__ import annotations

from ..svg import SANS, document, esc
from ..theme import Theme

W, H = 900, 64


def render(index: str, label: str, t: Theme) -> str:
    css = ".dl{stroke-dasharray:var(--len);animation:draw 1.4s cubic-bezier(.2,.7,.2,1) both}"
    body = (
        f'<text x="2" y="42" font-size="12" letter-spacing="2" fill="{t.dim}">{esc(index)}</text>'
        f'<text class="sans" x="40" y="44" font-size="26" font-weight="300" letter-spacing="7" fill="{t.fg}">{esc(label.upper())}</text>'
        f'<path class="dl" style="--len:900" d="M0 62H900" stroke="{t.line}"/>'
        f'<path d="M0 62H40" stroke="{t.fg}" stroke-width="1.5"/>'
    )
    return document(W, H, body, title=label, css=css)
