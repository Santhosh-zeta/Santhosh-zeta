"""Render every card, in both themes, into an output directory."""
from __future__ import annotations

from pathlib import Path
from typing import Dict, List

from .cards import about, activity, connect, hero, project, section, stack, stats
from .model import Context
from .theme import THEMES

SECTIONS = [("01", "About", "about"), ("02", "Stack", "stack"), ("03", "Activity", "activity"), ("04", "Work", "work"), ("05", "Contact", "contact")]

# Cards that need no live data: committed to the repo, so the profile renders instantly.
STATIC = ("hero", "about", "stack", "connect") + tuple(f"section-{s[2]}" for s in SECTIONS)


def render_static(ctx: Context) -> Dict[str, str]:
    out: Dict[str, str] = {}
    for tname, t in THEMES.items():
        out[f"hero-{tname}.svg"] = hero.render(ctx, t)
        out[f"about-{tname}.svg"] = about.render(ctx, t)
        out[f"stack-{tname}.svg"] = stack.render(ctx, t)
        out[f"connect-{tname}.svg"] = connect.render(ctx, t)
        for idx, label, key in SECTIONS:
            out[f"section-{key}-{tname}.svg"] = section.render(idx, label, t)
    return out


def render_live(ctx: Context) -> Dict[str, str]:
    out: Dict[str, str] = {}
    if ctx.data is None:
        return out
    for tname, t in THEMES.items():
        out[f"activity-{tname}.svg"] = activity.render(ctx, t)
        out[f"stats-{tname}.svg"] = stats.render(ctx, t)
        for i, repo in enumerate(ctx.data.featured, 1):
            out[f"project-{i}-{tname}.svg"] = project.render(i, repo, t, ctx.today)
    return out


def write(files: Dict[str, str], directory: Path, *, prune_prefixes: tuple = ()) -> None:
    directory.mkdir(parents=True, exist_ok=True)
    for stale in directory.glob("*.svg"):
        if stale.name not in files and any(stale.name.startswith(p) for p in prune_prefixes):
            stale.unlink()
    for name, svg in files.items():
        (directory / name).write_text(svg, encoding="utf-8")


def picture(src_base: str, name: str, alt: str, *, width: str = "100%") -> str:
    return (
        f'<picture>\n'
        f'  <source media="(prefers-color-scheme: dark)" srcset="{src_base}/{name}-dark.svg">\n'
        f'  <source media="(prefers-color-scheme: light)" srcset="{src_base}/{name}-light.svg">\n'
        f'  <img alt="{alt}" src="{src_base}/{name}-dark.svg" width="{width}">\n'
        f"</picture>"
    )


START, END = "<!-- work:start -->", "<!-- work:end -->"


def work_markdown(cfg, repos) -> str:
    """Two-column grid of clickable repo cards."""
    base = cfg.assets_base
    cells = []
    for i, r in enumerate(repos, 1):
        pic = picture(base, f"project-{i}", f"{r.full_name}: {r.description}", width="100%")
        cells.append(f'<td width="50%"><a href="{r.url}">\n{pic}\n</a></td>')
    rows = ["<tr>" + "".join(cells[i:i + 2]) + "</tr>" for i in range(0, len(cells), 2)]
    return "<table>\n" + "\n".join(rows) + "\n</table>"


def update_readme(text: str, block: str) -> str:
    if START not in text or END not in text:
        return text
    head, rest = text.split(START, 1)
    _, tail = rest.split(END, 1)
    return f"{head}{START}\n{block}\n{END}{tail}"
