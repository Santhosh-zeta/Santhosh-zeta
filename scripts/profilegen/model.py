"""Data the live cards render. Cards never do I/O."""
from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import date
from typing import List, Optional


@dataclass
class Day:
    date: str  # YYYY-MM-DD
    count: int
    level: int  # 0..4


@dataclass
class Streak:
    length: int
    start: Optional[str] = None
    end: Optional[str] = None


@dataclass
class Language:
    name: str
    size: int
    percent: float


@dataclass
class Repo:
    name: str
    full_name: str
    url: str
    description: str = ""
    stars: int = 0
    forks: int = 0
    language: str = ""
    pushed_at: str = ""
    archived: bool = False


@dataclass
class ProfileData:
    login: str
    created_at: str
    followers: int
    following: int
    public_repos: int
    total_stars: int
    total_forks: int
    total_commits: int
    total_prs: int
    total_issues: int
    total_reviews: int
    last_year_contributions: int
    calendar: List[Day]  # oldest first; weeks start on Sunday
    current_streak: Streak
    longest_streak: Streak
    languages: List[Language]
    featured: List[Repo]
    generated_at: str

    def to_json(self) -> dict:
        return asdict(self)

    @classmethod
    def from_json(cls, raw: dict) -> "ProfileData":
        raw = dict(raw)
        raw["calendar"] = [Day(**d) for d in raw["calendar"]]
        raw["current_streak"] = Streak(**raw["current_streak"])
        raw["longest_streak"] = Streak(**raw["longest_streak"])
        raw["languages"] = [Language(**x) for x in raw["languages"]]
        raw["featured"] = [Repo(**r) for r in raw["featured"]]
        return cls(**raw)


@dataclass
class Context:
    config: "object"
    data: Optional[ProfileData]
    today: date


def streaks(calendar: List[Day], today: date) -> "tuple[Streak, Streak]":
    """(current, longest). A zero-count *today* does not break the current streak yet."""
    longest, run, run_start = Streak(0), 0, None
    prev = None
    for d in calendar:
        if d.count > 0:
            if run == 0:
                run_start = d.date
            run += 1
            if run > longest.length:
                longest = Streak(run, run_start, d.date)
        else:
            run = 0
        prev = d
    current = Streak(0)
    days = list(calendar)
    if days and days[-1].date == today.isoformat() and days[-1].count == 0:
        days = days[:-1]
    run, end = 0, None
    for d in reversed(days):
        if d.count > 0:
            run += 1
            end = end or d.date
            current = Streak(run, d.date, end)
        else:
            break
    return current, longest
