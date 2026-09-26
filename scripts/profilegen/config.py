from __future__ import annotations

import tomllib
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List


@dataclass
class StackGroup:
    label: str
    icons: List[str]


@dataclass
class Config:
    username: str
    name: str
    tagline: str
    typing_lines: List[str]
    links: Dict[str, str]
    stack: List[StackGroup]
    featured_count: int = 4
    featured_exclude: List[str] = field(default_factory=list)
    languages_count: int = 8
    languages_exclude: List[str] = field(default_factory=list)
    theme_overrides: Dict[str, Dict[str, str]] = field(default_factory=dict)

    @property
    def assets_base(self) -> str:
        return f"https://raw.githubusercontent.com/{self.username}/{self.username}/output"


def load(path: Path) -> Config:
    raw = tomllib.loads(Path(path).read_text(encoding="utf-8"))
    profile = raw["profile"]
    featured = raw.get("featured", {})
    languages = raw.get("languages", {})
    return Config(
        username=profile["username"],
        name=profile.get("name") or profile["username"],
        tagline=profile.get("tagline", ""),
        typing_lines=list(profile.get("typing_lines") or [profile.get("name") or profile["username"]]),
        links=dict(raw.get("links", {})),
        stack=[StackGroup(label=g["label"], icons=list(g["icons"])) for g in raw.get("stack", [])],
        featured_count=int(featured.get("count", 4)),
        featured_exclude=list(featured.get("exclude", [])),
        languages_count=int(languages.get("count", 8)),
        languages_exclude=list(languages.get("exclude", [])),
        theme_overrides={k: dict(v) for k, v in raw.get("theme", {}).items()},
    )
