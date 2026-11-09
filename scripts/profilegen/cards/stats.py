"""Numbers + languages. Languages are told apart by pattern and shade, not hue."""
from __future__ import annotations

from ..svg import delay, document, esc, fmt_compact, frame, n, ticks
from ..theme import Theme

W, H = 900, 360
PAD = 36


def patterns(t: Theme) -> str:
    fg, mu, dm, fa, bg = t.fg, t.muted, t.dim, t.faint, t.bg
    return (
        f'<pattern id="p0" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="{fg}"/></pattern>'
        f'<pattern id="p1" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="{mu}"/></pattern>'
        f'<pattern id="p2" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="{bg}"/><rect width="2.2" height="5" fill="{fg}"/></pattern>'
        f'<pattern id="p3" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="{bg}"/><circle cx="2.5" cy="2.5" r="1.4" fill="{fg}"/></pattern>'
        f'<pattern id="p4" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="{dm}"/></pattern>'
        f'<pattern id="p5" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="{bg}"/><rect width="4" height="1.6" fill="{fg}"/></pattern>'
        f'<pattern id="p6" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="{bg}"/><rect width="1.4" height="5" fill="{mu}"/><rect width="5" height="1.4" fill="{mu}"/></pattern>'
        f'<pattern id="p7" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="{fa}"/></pattern>'
    )


def render(ctx, t: Theme) -> str:
    d = ctx.data
    parts = [frame(W, H, t), ticks(W, H, t)]
    parts.append(f'<text x="{PAD}" y="40" font-size="11" letter-spacing="3" fill="{t.dim}">NUMBERS · ALL TIME</text>')
    figs = [
        ("COMMITS", d.total_commits), ("PULL REQUESTS", d.total_prs), ("ISSUES", d.total_issues),
        ("STARS EARNED", d.total_stars), ("FOLLOWERS", d.followers),
    ]
    colw = (W - 2 * PAD) / len(figs)
    for i, (lab, val) in enumerate(figs):
        x = PAD + i * colw
        if i:
            parts.append(f'<path d="M{n(x - 12)} 62V128" stroke="{t.line_soft}"/>')
        parts.append(
            f'<g class="rise" {delay(0.1 * i)}>'
            f'<text class="sans" x="{n(x)}" y="108" font-size="44" font-weight="200" fill="{t.fg}">{esc(fmt_compact(val))}</text>'
            f'<text x="{n(x + 1)}" y="130" font-size="10" letter-spacing="2" fill="{t.dim}">{lab}</text></g>'
        )
    parts.append(f'<path d="M{PAD} 158H{W - PAD}" stroke="{t.line}"/>')
    parts.append(f'<text x="{PAD}" y="190" font-size="11" letter-spacing="3" fill="{t.dim}">LANGUAGES</text>')
    langs = d.languages
    bar_x, bar_w, bar_y, bar_h = PAD, W - 2 * PAD, 206, 14
    if langs:
        total = sum(l.percent for l in langs) or 1
        x = bar_x
        for i, l in enumerate(langs):
            w = bar_w * l.percent / total
            parts.append(
                f'<rect class="fade" {delay(0.4 + 0.08 * i)} x="{n(round(x, 2))}" y="{bar_y}" width="{n(max(round(w - 2, 2), 1))}" '
                f'height="{bar_h}" fill="url(#p{i % 8})" stroke="{t.fg if i % 8 in (2, 3, 5, 6) else "none"}" stroke-width=".6"/>'
            )
            x += w
        cols = 4
        cw = (W - 2 * PAD) / cols
        for i, l in enumerate(langs):
            cx, cy = PAD + (i % cols) * cw, 252 + (i // cols) * 34
            parts.append(
                f'<g class="rise" {delay(0.6 + 0.06 * i)}>'
                f'<rect x="{n(cx)}" y="{cy - 10}" width="12" height="12" fill="url(#p{i % 8})" stroke="{t.line}"/>'
                f'<text x="{n(cx + 20)}" y="{cy}" font-size="12.5" fill="{t.fg}">{esc(l.name)}</text>'
                f'<text x="{n(cx + cw - 22)}" y="{cy}" font-size="11" fill="{t.dim}" text-anchor="end">{l.percent:.1f}%</text></g>'
            )
    else:
        parts.append(f'<text x="{PAD}" y="250" font-size="12" fill="{t.dim}">No language data yet.</text>')
    parts.append(f'<text x="{PAD}" y="{H - 14}" font-size="9" letter-spacing="1.5" fill="{t.faint}">{d.public_repos} PUBLIC REPOS · UPDATED {esc(d.generated_at[:10])}</text>')
    return document(W, H, "".join(parts), title="GitHub numbers and languages", css="", defs=patterns(t),
                    desc=", ".join(f"{lab}: {v}" for lab, v in figs) + ". Languages: " + ", ".join(f"{l.name} {l.percent:.1f}%" for l in langs))
