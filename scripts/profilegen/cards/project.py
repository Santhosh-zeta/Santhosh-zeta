"""One repository card (440 x 196)."""
from __future__ import annotations

from datetime import date

from ..model import Repo
from ..svg import document, esc, fmt_compact, frame, n, ticks, wrap
from ..theme import Theme

W, H = 440, 196
PAD = 24
NAME_COLS = int((W - 2 * PAD - 24) // (23 * 0.56))
STAR = "M7 .9l1.9 4.2 4.6.4-3.5 3 1.1 4.5L7 10.7 2.9 13l1.1-4.5-3.5-3 4.6-.4z"


def _ago(iso: str, today: date) -> str:
    try:
        d = date.fromisoformat(iso[:10])
    except ValueError:
        return ""
    days = (today - d).days
    if days < 1:
        return "today"
    if days < 31:
        return f"{days}d ago"
    if days < 365:
        return f"{days // 30}mo ago"
    return f"{days // 365}y ago"


def render(index: int, repo: Repo, t: Theme, today: date) -> str:
    parts = [frame(W, H, t), ticks(W, H, t, inset=9, size=6)]
    parts.append(f'<text x="{PAD}" y="38" font-size="10" letter-spacing="2.4" fill="{t.dim}">{index:02d} / {esc(repo.full_name.split("/")[0].upper())}</text>')
    # arrow
    parts.append(f'<path d="M{W - PAD - 11} {PAD + 4}h11v11M{W - PAD} {PAD + 4}l-12 12" stroke="{t.muted}" stroke-width="1.3"/>')
    name = repo.name if len(repo.name) <= NAME_COLS else repo.name[: NAME_COLS - 1] + "…"
    parts.append(f'<text class="sans" x="{PAD}" y="72" font-size="23" fill="{t.fg}">{esc(name)}</text>')
    desc = wrap(repo.description or "No description yet.", 11.5, W - 2 * PAD, 3)
    for i, ln in enumerate(desc):
        parts.append(f'<text x="{PAD}" y="{102 + i * 18}" font-size="11.5" fill="{t.muted}">{esc(ln)}</text>')
    y = H - 28
    parts.append(f'<path d="M{PAD} {y - 18}H{W - PAD}" stroke="{t.line_soft}"/>')
    x = PAD
    if repo.language:
        parts.append(f'<circle cx="{x + 4}" cy="{y - 3}" r="4" fill="{t.fg}"/>')
        parts.append(f'<text x="{x + 16}" y="{y}" font-size="11" fill="{t.fg}">{esc(repo.language)}</text>')
        x += 16 + len(repo.language) * 6.6 + 18
    parts.append(f'<path transform="translate({n(x)} {y - 11}) scale(.85)" d="{STAR}" fill="{t.muted}"/>')
    parts.append(f'<text x="{n(x + 17)}" y="{y}" font-size="11" fill="{t.muted}">{esc(fmt_compact(repo.stars))}</text>')
    x += 17 + len(fmt_compact(repo.stars)) * 6.6 + 16
    parts.append(
        f'<g transform="translate({n(x)} {y - 11})" stroke="{t.muted}" stroke-width="1.2"><circle cx="2.5" cy="2" r="1.7"/><circle cx="9.5" cy="2" r="1.7"/>'
        f'<circle cx="6" cy="11" r="1.7"/><path d="M2.5 3.7v1.6q0 1.6 1.6 1.6h3.8q1.6 0 1.6-1.6V3.7M6 6.9v2.4"/></g>'
    )
    parts.append(f'<text x="{n(x + 17)}" y="{y}" font-size="11" fill="{t.muted}">{esc(fmt_compact(repo.forks))}</text>')
    ago = _ago(repo.pushed_at, today)
    if ago:
        parts.append(f'<text x="{W - PAD}" y="{y}" font-size="10" fill="{t.dim}" text-anchor="end">updated {esc(ago)}</text>')
    css = ".scan{animation:scan 7s linear infinite}@keyframes scan{0%{transform:translateY(0);opacity:0}8%{opacity:.14}92%{opacity:.14}100%{transform:translateY(190px);opacity:0}}"
    parts.append(f'<rect class="scan" x="1" y="3" width="{W - 2}" height="1" fill="{t.fg}" opacity="0" style="animation-delay:{index * 1.3:.1f}s"/>')
    return document(W, H, "".join(parts), title=repo.full_name, css=css,
                    desc=f"{repo.full_name}. {repo.description} {repo.language}, {repo.stars} stars, {repo.forks} forks.")
