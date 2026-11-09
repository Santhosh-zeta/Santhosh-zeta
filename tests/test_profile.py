import sys
import unittest
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from profilegen import build, config, github, sample  # noqa: E402
from profilegen.model import Context, Day, streaks  # noqa: E402
from profilegen.svg import wrap  # noqa: E402

TODAY = date(2026, 11, 9)
CFG = config.load(ROOT / "profile.toml")


class Rendering(unittest.TestCase):
    def test_every_card_is_wellformed_for_every_sample(self):
        for kind in sample.KINDS:
            ctx = Context(CFG, sample.sample_profile(kind, TODAY), TODAY)
            files = {**build.render_static(ctx), **build.render_live(ctx)}
            self.assertTrue(files)
            for name, svg in files.items():
                with self.subTest(kind=kind, card=name):
                    ET.fromstring(svg)

    def test_palette_is_strictly_monochrome(self):
        import re
        ctx = Context(CFG, sample.sample_profile("rich", TODAY), TODAY)
        for name, svg in {**build.render_static(ctx), **build.render_live(ctx)}.items():
            for hexcol in re.findall(r"#([0-9a-fA-F]{6})\b", svg):
                r, g, b = hexcol[0:2], hexcol[2:4], hexcol[4:6]
                self.assertEqual((r, g), (g, b), f"{name} has colour #{hexcol}")

    def test_hostile_text_is_escaped(self):
        data = sample.sample_profile("rich", TODAY)
        data.featured[0].description = '<script>alert("x")</script> & more'
        svg = build.render_live(Context(CFG, data, TODAY))["project-1-dark.svg"]
        self.assertNotIn("<script>", svg)
        ET.fromstring(svg)

    def test_static_assets_are_up_to_date(self):
        files = build.render_static(Context(CFG, None, TODAY))
        for name, svg in files.items():
            on_disk = (ROOT / "assets" / name).read_text(encoding="utf-8")
            # hero shows the year from config only, so this is date independent
            self.assertEqual(svg, on_disk, f"assets/{name} is stale: run python scripts/generate.py --static")


class Helpers(unittest.TestCase):
    def test_wrap_ellipsises(self):
        lines = wrap("word " * 80, 11.5, 300, 3)
        self.assertEqual(len(lines), 3)
        self.assertTrue(lines[-1].endswith("…"))

    def test_streaks(self):
        counts = [1, 1, 0, 1, 1, 1, 0, 2, 3]
        cal = [Day(f"2026-11-{i + 1:02d}", c, 1 if c else 0) for i, c in enumerate(counts)]
        cur, longest = streaks(cal, date(2026, 11, 9))
        self.assertEqual((cur.length, longest.length), (2, 3))

    def test_todays_zero_does_not_break_streak(self):
        cal = [Day("2026-11-07", 1, 1), Day("2026-11-08", 2, 1), Day("2026-11-09", 0, 0)]
        cur, _ = streaks(cal, date(2026, 11, 9))
        self.assertEqual(cur.length, 2)


class GitHubParsing(unittest.TestCase):
    def test_fetch_with_fake_transport(self):
        cal = {"totalContributions": 3, "weeks": [{"contributionDays": [
            {"date": "2026-11-07", "contributionCount": 1, "contributionLevel": "FIRST_QUARTILE"},
            {"date": "2026-11-08", "contributionCount": 2, "contributionLevel": "FOURTH_QUARTILE"},
            {"date": "2026-11-09", "contributionCount": 0, "contributionLevel": "NONE"}]}]}

        def send(query, variables):
            if "pinnedItems" in query:
                return {"user": {"createdAt": "2025-01-01T00:00:00Z", "followers": {"totalCount": 5}, "following": {"totalCount": 2},
                                 "repositories": {"totalCount": 3}, "pullRequests": {"totalCount": 4}, "issues": {"totalCount": 1},
                                 "pinnedItems": {"nodes": []}, "contributionsCollection": {"contributionCalendar": cal}}}
            if "y2025" in query:
                return {"user": {"y2025": {"totalCommitContributions": 10, "totalPullRequestReviewContributions": 1},
                                 "y2026": {"totalCommitContributions": 5, "totalPullRequestReviewContributions": 0}}}
            if "repositories(first:100" in query:
                return {"user": {"repositories": {"pageInfo": {"hasNextPage": False, "endCursor": None}, "nodes": [
                    {"stargazerCount": 3, "forkCount": 1, "languages": {"edges": [{"size": 90, "node": {"name": "Python"}}, {"size": 10, "node": {"name": "Shell"}}]}}]}}}
            return {f"r{i}": {"nameWithOwner": n, "url": f"https://github.com/{n}", "description": None, "stargazerCount": 1,
                              "forkCount": 0, "pushedAt": "2026-11-01T00:00:00Z", "isArchived": False, "primaryLanguage": None}
                    for i, n in enumerate(CFG.featured_repos[: CFG.featured_count])}

        from datetime import datetime, timezone
        data = github.fetch(CFG, TODAY, datetime(2026, 11, 9, tzinfo=timezone.utc), send)
        self.assertEqual((data.total_commits, data.total_stars, data.followers), (15, 3, 5))
        self.assertEqual(data.languages[0].name, "Python")
        self.assertEqual(data.current_streak.length, 2)
        self.assertEqual(len(data.featured), min(CFG.featured_count, len(CFG.featured_repos)))
        ctx = Context(CFG, data, TODAY)
        for svg in build.render_live(ctx).values():
            ET.fromstring(svg)


class Readme(unittest.TestCase):
    def test_markers_roundtrip(self):
        text = f"a\n{build.START}\nold\n{build.END}\nb"
        data = sample.sample_profile("rich", TODAY)
        new = build.update_readme(text, build.work_markdown(CFG, data.featured))
        self.assertIn("project-1-dark.svg", new)
        self.assertTrue(new.startswith("a\n") and new.endswith("\nb"))
        self.assertEqual(build.update_readme(new, build.work_markdown(CFG, data.featured)), new)


if __name__ == "__main__":
    unittest.main()
