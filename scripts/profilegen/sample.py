         "Full-stack starter: React + Node + Postgres with auth, payments and one-command Docker deploys.",
         "https://shipfast.example.dev", 86, 14, "JavaScript", "#f1e05a", ["react", "nodejs"], "2026-09-12T10:00:00Z", False, True),
    Repo("pocket-budget", "Santhosh-zeta/pocket-budget", "https://github.com/Santhosh-zeta/pocket-budget",
         "Offline-first expense tracker built with Flutter & Dart, synced through a tiny Kotlin backend.",
         "", 41, 6, "Dart", "#00B4AB", ["flutter"], "2026-08-30T10:00:00Z", False, True),
    Repo("infra-as-code-playground-with-an-extremely-long-repository-name", "Santhosh-zeta/infra",
         "https://github.com/Santhosh-zeta/infra",
         "Terraform & GitHub Actions recipes <for> AWS: ECS, RDS & CloudFront — plus a deliberately very long description that must be wrapped and truncated gracefully instead of overflowing the card edge.",
         "", 12_345, 1_203, "HCL", "#844FBA", [], "2026-07-01T10:00:00Z", False, False),
]


def sample_profile(kind: str = "rich", today: date = date(2026, 9, 25)) -> ProfileData:
    if kind not in KINDS:
        raise ValueError(f"unknown sample kind {kind!r}; expected one of {KINDS}")
    rng = random.Random(f"{kind}-{today.isoformat()}")
    if kind == "empty":
        cal = _calendar(today, rng, 0.0, 1)
    elif kind == "new":
        cal = _calendar(today, rng, 0.18, 2)
        cutoff = (today - timedelta(days=75)).isoformat()
        cal = [d if d.date >= cutoff else Day(d.date, 0, 0) for d in cal]
        levels = bucket_levels([d.count for d in cal])
        cal = [Day(d.date, d.count, lv) for d, lv in zip(cal, levels)]
    else:
        cal = _calendar(today, rng, 0.72, 5)
    current, longest = _streaks(cal, today)
    last_year = sum(d.count for d in cal)
    first = next((d.date for d in cal if d.count > 0), None)

    if kind == "rich":
        langs_raw, repos = LANGS[:8], REPOS
        stats = dict(followers=312, following=87, public_repos=46, total_stars=12_641, total_forks=1_260,
                     total_commits=4_873, total_prs=392, total_issues=141, total_reviews=77, contributed_to=23)
        total = last_year + 5_210
        first = "2021-02-14"
    elif kind == "new":
        langs_raw, repos = LANGS[:2], REPOS[1:2]
        stats = dict(followers=3, following=12, public_repos=2, total_stars=1, total_forks=0,
                     total_commits=58, total_prs=2, total_issues=1, total_reviews=0, contributed_to=0)
        total = last_year
    else:
        langs_raw, repos = [], []
        stats = dict(followers=0, following=0, public_repos=0, total_stars=0, total_forks=0,
                     total_commits=0, total_prs=0, total_issues=0, total_reviews=0, contributed_to=0)
        total = 0

    size_sum = sum(s for _, _, s in langs_raw) or 1
    languages = [Language(n, c, s, round(100 * s / size_sum, 2)) for n, c, s in langs_raw]
    if kind == "rich":
        longest = Streak(max(longest.length, 97), "2024-11-02", "2025-02-06") if longest.length < 97 else longest

    return ProfileData(
        login="Santhosh-zeta",
        name="Santhosh",
        bio="Full-Stack · ML · Mobile · DevOps",
        created_at="2021-02-10T08:00:00Z" if kind == "rich" else f"{today.year}-06-01T08:00:00Z",
        last_year_contributions=last_year,
        total_contributions=total,
        calendar=cal,
        current_streak=current,
        longest_streak=longest,
        first_contribution=first,
        languages=languages,
        featured=list(repos),
        generated_at=f"{today.isoformat()}T03:17:00Z",
        **stats,
    )
