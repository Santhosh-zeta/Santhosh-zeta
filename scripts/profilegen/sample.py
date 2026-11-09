"""Deterministic synthetic data for previews and tests (never published)."""
from __future__ import annotations

import random
from datetime import date, timedelta

from .model import Day, Language, ProfileData, Repo, streaks

KINDS = ("rich", "new", "empty")


def bucket(counts):
    top = max(counts) or 1
    out = []
    for c in counts:
        out.append(0 if c == 0 else min(4, 1 + int(4 * (c - 1) / top)))
    return out


def calendar(today: date, rng: random.Random, density: float):
    start = today - timedelta(days=364)
    start -= timedelta(days=(start.weekday() + 1) % 7 * 0)  # keep exactly 365 days
    days = [start + timedelta(days=i) for i in range(365)]
    counts = []
    for d in days:
        weekend = d.weekday() >= 5
        p = density * (0.55 if weekend else 1)
        counts.append(int(rng.expovariate(1 / 4)) + 1 if rng.random() < p else 0)
    levels = bucket(counts)
    return [Day(d.isoformat(), c, lv) for d, c, lv in zip(days, counts, levels)]


def sample_profile(kind: str, today: date) -> ProfileData:
    if kind not in KINDS:
        raise ValueError(f"unknown sample kind {kind!r}")
    rng = random.Random(f"{kind}-{today}")
    dens = {"rich": 0.74, "new": 0.12, "empty": 0.0}[kind]
    cal = calendar(today, rng, dens)
    cur, longest = streaks(cal, today)
    langs = [("TypeScript", 38), ("Python", 24), ("Kotlin", 12), ("Dart", 9), ("HCL", 6), ("Go", 5), ("Shell", 4), ("CSS", 2)]
    repos = [
        Repo("shipfast", "Santhosh-zeta/shipfast", "https://github.com/Santhosh-zeta/shipfast",
             "Full-stack starter: React, Node and Postgres with auth, payments and one-command Docker deploys.", 86, 14, "TypeScript", "2026-09-12T10:00:00Z"),
        Repo("pocket-budget", "Santhosh-zeta/pocket-budget", "https://github.com/Santhosh-zeta/pocket-budget",
             "Offline-first expense tracker built with Flutter, synced through a tiny Kotlin backend.", 41, 6, "Dart", "2026-08-30T10:00:00Z"),
        Repo("infra-as-code-playground-with-an-extremely-long-repository-name", "Santhosh-zeta/infra", "https://github.com/Santhosh-zeta/infra",
             "Terraform & GitHub Actions recipes <for> AWS — plus a deliberately very long description that must be wrapped and truncated gracefully instead of overflowing the card edge.", 12345, 1203, "HCL", "2025-07-01T10:00:00Z"),
        Repo("no-description", "Santhosh-zeta/no-description", "https://github.com/Santhosh-zeta/no-description", "", 0, 0, "", ""),
    ]
    rich = kind == "rich"
    total = sum(s for _, s in langs) or 1
    return ProfileData(
        login="Santhosh-zeta", created_at="2021-02-10T08:00:00Z", followers=312 if rich else 3, following=87 if rich else 1,
        public_repos=46 if rich else 2, total_stars=12641 if rich else 1, total_forks=1260 if rich else 0,
        total_commits=4873 if rich else 58, total_prs=392 if rich else 2, total_issues=141 if rich else 1, total_reviews=77,
        last_year_contributions=sum(d.count for d in cal), calendar=cal, current_streak=cur, longest_streak=longest,
        languages=[Language(n, s, round(100 * s / total, 2)) for n, s in langs] if kind != "empty" else [],
        featured=repos if rich else repos[:1] if kind == "new" else [], generated_at=f"{today}T03:17:00Z",
    )
