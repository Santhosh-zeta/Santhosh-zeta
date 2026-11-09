#!/usr/bin/env python3
"""Render the profile's SVG cards.

  generate.py --static                    rewrite committed cards in assets/
  generate.py --live --out dist           fetch GitHub data, render live cards (needs GITHUB_TOKEN)
  generate.py --sample rich --out /tmp/x  render everything from synthetic data (no network)
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import date, datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from profilegen import build, config as config_mod, github, sample  # noqa: E402
from profilegen.model import Context, ProfileData  # noqa: E402


def annotate(level: str, msg: str) -> None:
    print(f"::{level}::{msg}" if os.environ.get("GITHUB_ACTIONS") else f"{level}: {msg}", file=sys.stderr)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--config", type=Path, default=ROOT / "profile.toml")
    ap.add_argument("--out", type=Path, default=ROOT / "dist")
    ap.add_argument("--static", action="store_true", help="render the data-free cards into assets/")
    ap.add_argument("--live", action="store_true", help="fetch GitHub data and render the live cards")
    ap.add_argument("--sample", choices=sample.KINDS, help="synthetic data, renders every card")
    ap.add_argument("--readme", type=Path, help="README whose work grid should be refreshed (with --live)")
    ap.add_argument("--today", type=date.fromisoformat)
    args = ap.parse_args(argv)

    cfg = config_mod.load(args.config)
    now = datetime.now(timezone.utc)
    today = args.today or now.date()

    if args.static:
        files = build.render_static(Context(cfg, None, today))
        build.write(files, ROOT / "assets", prune_prefixes=build.STATIC)
        print(f"wrote {len(files)} static cards to assets/")
        return 0

    if args.sample:
        data = sample.sample_profile(args.sample, today)
        ctx = Context(cfg, data, today)
        files = {**build.render_static(ctx), **build.render_live(ctx)}
        build.write(files, args.out)
        print(f"wrote {len(files)} sample cards to {args.out}")
        return 0

    if args.live:
        token = os.environ.get("GITHUB_TOKEN")
        if not token:
            annotate("error", "GITHUB_TOKEN is not set")
            return 1
        try:
            data = github.fetch(cfg, today, now, github.http_transport(token))
        except Exception as exc:  # keep the last published cards on any failure
            annotate("error", f"could not load GitHub data: {exc}")
            return 1
        ctx = Context(cfg, data, today)
        files = build.render_live(ctx)
        build.write(files, args.out, prune_prefixes=("project-",))
        (args.out / "data.json").write_text(json.dumps(data.to_json(), indent=1, ensure_ascii=False), encoding="utf-8")
        print(f"wrote {len(files)} live cards to {args.out}")
        if args.readme:
            text = args.readme.read_text(encoding="utf-8")
            new = build.update_readme(text, build.work_markdown(cfg, data.featured))
            if new != text:
                args.readme.write_text(new, encoding="utf-8")
                print(f"refreshed work grid in {args.readme}")
        return 0

    ap.error("choose one of --static, --live, --sample")


if __name__ == "__main__":
    sys.exit(main())
