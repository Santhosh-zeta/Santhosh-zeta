"""Live data via the GitHub GraphQL API (stdlib only)."""
from __future__ import annotations

import json
import urllib.request
from datetime import date, datetime, timezone
from typing import Callable, Dict, List, Optional

from .config import Config
from .model import Day, Language, ProfileData, Repo, streaks

API = "https://api.github.com/graphql"
LEVELS = {"NONE": 0, "FIRST_QUARTILE": 1, "SECOND_QUARTILE": 2, "THIRD_QUARTILE": 3, "FOURTH_QUARTILE": 4}

Transport = Callable[[str, dict], dict]


def http_transport(token: str) -> Transport:
    def send(query: str, variables: dict) -> dict:
        req = urllib.request.Request(
            API,
            data=json.dumps({"query": query, "variables": variables}).encode(),
            headers={"Authorization": f"bearer {token}", "Content-Type": "application/json", "User-Agent": "profilegen"},
        )
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = json.load(resp)
        if body.get("errors") and not body.get("data"):
            raise RuntimeError(body["errors"][0].get("message", "GraphQL error"))
        return body["data"]

    return send


USER_Q = """
query($login:String!){ user(login:$login){
  createdAt
  followers{totalCount} following{totalCount}
  repositories(ownerAffiliations:OWNER, privacy:PUBLIC){totalCount}
  pullRequests{totalCount} issues{totalCount}
  pinnedItems(first:6,types:REPOSITORY){nodes{... on Repository{nameWithOwner}}}
  contributionsCollection{ contributionCalendar{ totalContributions
    weeks{contributionDays{date contributionCount contributionLevel}} } }
}}"""

REPOS_Q = """
query($login:String!,$after:String){ user(login:$login){
  repositories(first:100, after:$after, ownerAffiliations:OWNER, isFork:false, privacy:PUBLIC){
    pageInfo{hasNextPage endCursor}
    nodes{ stargazerCount forkCount languages(first:8, orderBy:{field:SIZE,direction:DESC}){edges{size node{name}}} }
  } } }"""


def _repo_fields() -> str:
    return "nameWithOwner url description stargazerCount forkCount pushedAt isArchived primaryLanguage{name}"


def years_query(years: List[int]) -> str:
    parts = [
        f'y{y}: contributionsCollection(from:"{y}-01-01T00:00:00Z", to:"{y}-12-31T23:59:59Z")'
        "{ totalCommitContributions totalPullRequestReviewContributions }"
        for y in years
    ]
    return "query($login:String!){ user(login:$login){ " + " ".join(parts) + " } }"


def featured_query(names: List[str]) -> str:
    parts = []
    for i, full in enumerate(names):
        owner, _, name = full.partition("/")
        parts.append(f'r{i}: repository(owner:{json.dumps(owner)}, name:{json.dumps(name)}){{ {_repo_fields()} }}')
    return "query{ " + " ".join(parts) + " }"


def parse_repo(node: Dict) -> Repo:
    lang = (node.get("primaryLanguage") or {}).get("name", "")
    return Repo(
        name=node["nameWithOwner"].split("/")[-1], full_name=node["nameWithOwner"], url=node["url"],
        description=(node.get("description") or "").strip(), stars=node["stargazerCount"], forks=node["forkCount"],
        language=lang, pushed_at=node.get("pushedAt") or "", archived=bool(node.get("isArchived")),
    )


def fetch(cfg: Config, today: date, now: datetime, send: Transport) -> ProfileData:
    login = cfg.username
    user = send(USER_Q, {"login": login})["user"]
    created = user["createdAt"]
    cal_raw = user["contributionsCollection"]["contributionCalendar"]
    calendar = [
        Day(d["date"], d["contributionCount"], LEVELS.get(d["contributionLevel"], 0))
        for w in cal_raw["weeks"] for d in w["contributionDays"]
    ]
    cur, longest = streaks(calendar, today)

    # all-time commits / reviews, one aliased query for every year since signup
    years = list(range(int(created[:4]), today.year + 1))
    yq = send(years_query(years), {"login": login})["user"]
    commits = sum(v["totalCommitContributions"] for v in yq.values())
    reviews = sum(v["totalPullRequestReviewContributions"] for v in yq.values())

    # stars, forks, languages across public non-fork repos
    stars = forks = 0
    sizes: Dict[str, int] = {}
    after = None
    while True:
        page = send(REPOS_Q, {"login": login, "after": after})["user"]["repositories"]
        for r in page["nodes"]:
            stars += r["stargazerCount"]
            forks += r["forkCount"]
            for e in r["languages"]["edges"]:
                sizes[e["node"]["name"]] = sizes.get(e["node"]["name"], 0) + e["size"]
        if not page["pageInfo"]["hasNextPage"]:
            break
        after = page["pageInfo"]["endCursor"]
    for ex in cfg.languages_exclude:
        for k in [k for k in sizes if k.lower() == ex]:
            del sizes[k]
    total = sum(sizes.values()) or 1
    ranked = sorted(sizes.items(), key=lambda kv: -kv[1])[: cfg.languages_count]
    shown_total = sum(s for _, s in ranked) or 1
    languages = [Language(n, s, round(100 * s / shown_total, 2)) for n, s in ranked]

    # featured repos: configured list, else pinned, else most starred
    names = list(cfg.featured_repos) or [x["nameWithOwner"] for x in user["pinnedItems"]["nodes"] if x]
    names = names[: cfg.featured_count]
    featured: List[Repo] = []
    if names:
        raw = send(featured_query(names), {})
        for i in range(len(names)):
            node = raw.get(f"r{i}")
            if node:
                featured.append(parse_repo(node))

    return ProfileData(
        login=login, created_at=created, followers=user["followers"]["totalCount"], following=user["following"]["totalCount"],
        public_repos=user["repositories"]["totalCount"], total_stars=stars, total_forks=forks, total_commits=commits,
        total_prs=user["pullRequests"]["totalCount"], total_issues=user["issues"]["totalCount"], total_reviews=reviews,
        last_year_contributions=cal_raw["totalContributions"], calendar=calendar, current_streak=cur, longest_streak=longest,
        languages=languages, featured=featured, generated_at=now.strftime("%Y-%m-%dT%H:%M:%SZ"),
    )
