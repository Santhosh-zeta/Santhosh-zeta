"""Activity: a year of contributions as a greyscale grid, with streak figures."""
from __future__ import annotations

from datetime import date

from ..model import Day
from ..svg import delay, document, esc, fmt_int, frame, n, ticks
from ..theme import Theme

W, H = 900, 300
PAD, LABEL_W, TOP = 36, 30, 66
MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()


def _short(iso: str) -> str:
    d = date.fromisoformat(iso)
    return f"{MONTHS[d.month - 1]} {d.day}"


def render(ctx, t: Theme) -> str:
    data = ctx.data
    cal = data.calendar
    first = date.fromisoformat(cal[0].date)
    offset = (first.weekday() + 1) % 7  # Sunday-first column offset of the first day
    weeks = (len(cal) + offset + 6) // 7
    gx0 = PAD + LABEL_W
    pitch = (W - PAD - gx0) / weeks
    cell = pitch - 3
    parts = [frame(W, H, t), ticks(W, H, t)]
    parts.append(f'<text x="{PAD}" y="40" font-size="11" letter-spacing="3" fill="{t.dim}">CONTRIBUTIONS · LAST 12 MONTHS</text>')
    total = f"{fmt_int(data.last_year_contributions)}"
    parts.append(f'<text x="{W - PAD}" y="40" font-size="11" letter-spacing="3" fill="{t.fg}" text-anchor="end">{total} TOTAL</text>')
    for r, lbl in ((1, "Mon"), (3, "Wed"), (5, "Fri")):
        parts.append(f'<text x="{PAD}" y="{TOP + r * pitch + cell - 2}" font-size="9" fill="{t.dim}">{lbl}</text>')
    last_month = -1
    cells = []
    for i, d in enumerate(cal):
        k = i + offset
        wk, row = divmod(k, 7)
        dt = date.fromisoformat(d.date)
        if row == 0 and dt.month != last_month and wk < weeks - 2:
            last_month = dt.month
            parts.append(f'<text x="{n(gx0 + wk * pitch)}" y="{TOP - 10}" font-size="9" fill="{t.dim}">{MONTHS[dt.month - 1]}</text>')
        x, y = gx0 + wk * pitch, TOP + row * pitch
        stroke = f' stroke="{t.fg}" stroke-width="1"' if d.date == ctx.today.isoformat() else ""
        cells.append(
            f'<rect class="fade" {delay(wk * 0.018 + row * 0.012)} x="{n(round(x, 2))}" y="{n(round(y, 2))}" '
            f'width="{n(round(cell, 2))}" height="{n(round(cell, 2))}" fill="{t.levels[d.level]}"{stroke}/>'
        )
    parts.append("".join(cells))
    # legend
    ly = TOP + 7 * pitch + 6
    lx = W - PAD - 5 * 14 - 62
    parts.append(f'<text x="{lx}" y="{ly + 9}" font-size="9" fill="{t.dim}" text-anchor="end">Less</text>')
    for i, c in enumerate(t.levels):
        parts.append(f'<rect x="{lx + 8 + i * 14}" y="{ly}" width="11" height="11" fill="{c}"/>')
    parts.append(f'<text x="{lx + 8 + 5 * 14 + 4}" y="{ly + 9}" font-size="9" fill="{t.dim}">More</text>')
    # figures
    best = max(cal, key=lambda d: d.count)
    figs = [
        ("CURRENT STREAK", f"{data.current_streak.length}", "day" if data.current_streak.length == 1 else "days"),
        ("LONGEST STREAK", f"{data.longest_streak.length}", "day" if data.longest_streak.length == 1 else "days"),
        ("BEST DAY", f"{best.count}", _short(best.date) if best.count else "—"),
        ("ACTIVE DAYS", f"{sum(1 for d in cal if d.count)}", f"of {len(cal)}"),
    ]
    colw = (W - 2 * PAD) / 4
    fy = ly + 40
    parts.append(f'<path d="M{PAD} {fy - 12}H{W - PAD}" stroke="{t.line_soft}"/>')
    for i, (lab, val, sub) in enumerate(figs):
        x = PAD + i * colw
        parts.append(
            f'<g class="rise" {delay(0.6 + 0.1 * i)}>'
            f'<text x="{n(x)}" y="{fy + 8}" font-size="10" letter-spacing="2" fill="{t.dim}">{lab}</text>'
            f'<text class="sans" x="{n(x)}" y="{fy + 44}" font-size="34" font-weight="300" fill="{t.fg}">{esc(val)}</text>'
            f'<text x="{n(x + len(val) * 19 + 8)}" y="{fy + 44}" font-size="11" fill="{t.muted}">{esc(sub)}</text></g>'
        )
    return document(W, H, "".join(parts), title="Contribution activity",
                    desc=f"{data.last_year_contributions} contributions in the last year; current streak {data.current_streak.length} days; longest {data.longest_streak.length} days.")
