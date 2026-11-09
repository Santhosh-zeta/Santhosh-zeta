"""profile.toml -> typed config."""
from __future__ import annotations

import tomllib
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Tuple


@dataclass
class Config:
    username: str
    name: str
    year_label: str
    roles: List[str]
    typing_lines: List[str]
    status: str
    quote: str
    about_rows: List[Tuple[str, str]]
    stack: List[Tuple[str, List[str]]]
    links: Dict[str, str]
    featured_repos: List[str] = field(default_factory=list)
    featured_count: int = 4
    languages_count: int = 8
    languages_exclude: List[str] = field(default_factory=list)

    @property
    def assets_base(self) -> str:
        return f"https://raw.githubusercontent.com/{self.username}/{self.username}/output"


def load(path: Path) -> Config:
    raw = tomllib.loads(Path(path).read_text(encoding="utf-8"))
    p, about = raw["profile"], raw.get("about", {})
    feat, langs = raw.get("featured", {}), raw.get("languages", {})
    return Config(
        username=p["username"],
        name=p["name"],
        year_label=str(p.get("year_label", "")),
        roles=list(p.get("roles", [])),
        typing_lines=[s[:38] for s in p.get("typing_lines", [p["name"]])],
        status=p.get("status", ""),
        quote=about.get("quote", ""),
        about_rows=[(r["key"], r["value"]) for r in about.get("rows", [])],
        stack=[(g["label"], list(g["items"])) for g in raw.get("stack", [])],
        links=dict(raw.get("links", {})),
        featured_repos=list(feat.get("repos", [])),
        featured_count=int(feat.get("count", 4)),
        languages_count=int(langs.get("count", 8)),
        languages_exclude=[s.lower() for s in langs.get("exclude", [])],
    )
