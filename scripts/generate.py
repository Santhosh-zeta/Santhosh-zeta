    """Platane/snk `outputs` lines, coloured from the same palette as the cards."""
    themes = build_themes(cfg.theme_overrides)
    lines = []
    for name, theme in themes.items():
        palette = "palette=github-dark&" if name == "dark" else ""
        dots = ",".join(theme.levels)
        lines.append(f"dist/snake-{name}.svg?{palette}color_snake={theme.accent_2}&color_dots={dots}")
    return "snake<<SNAKE_EOF\n" + "\n".join(lines) + "\nSNAKE_EOF"


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--config", type=Path, default=ROOT / "profile.toml")
    parser.add_argument("--out", type=Path, default=ROOT / "dist")
    parser.add_argument("--readme", type=Path, help="README whose featured-projects block should be refreshed")
    source = parser.add_mutually_exclusive_group()
    source.add_argument("--sample", choices=sample.KINDS, help="render synthetic data (no network)")
    source.add_argument("--data", type=Path, help="render from a saved data.json (no network)")
    parser.add_argument("--fetch-icons", action="store_true", help="download missing skill icons into OUT/icons")
    parser.add_argument("--today", type=date.fromisoformat, help="override today's date (YYYY-MM-DD)")
    parser.add_argument("--snake-outputs", action="store_true", help="print Platane/snk outputs for $GITHUB_OUTPUT")
    args = parser.parse_args(argv)

    cfg = config_mod.load(args.config)
    if args.snake_outputs:
        print(snake_outputs(cfg))
        return 0

    now = datetime.now(timezone.utc)
    today = args.today or now.date()
    out = args.out
    out.mkdir(parents=True, exist_ok=True)
    icons = IconStore([ROOT / "assets" / "icons", out / "icons"], fetch=args.fetch_icons)
    failures: List[str] = []

    data: Optional[ProfileData] = None
    try:
        data = load_data(args, cfg, today, now)
    except Exception as exc:
        failures.append("github-data")
        annotate("error", f"Could not load GitHub data ({exc}); data cards keep their last published version")

    if data is not None:
        (out / "data.json").write_text(json.dumps(data.to_json(), indent=1, ensure_ascii=False), encoding="utf-8")
    (out / "README.md").write_text(OUTPUT_README, encoding="utf-8")

    written = render_cards(out, cfg, icons, data, today, failures)
    print(f"wrote {written} SVGs to {out}")
    if icons.misses:
        annotate("warning", "missing skill icons (fallback tiles used): " + ", ".join(sorted(set(icons.misses))))

    if data is not None and args.readme:
        text = args.readme.read_text(encoding="utf-8")
        updated = readme.update_readme(text, readme.featured_markdown(cfg, data.featured))
        if updated == text and readme.START not in text:
            annotate("warning", f"{args.readme} has no featured-projects markers; left untouched")
        elif updated != text:
            args.readme.write_text(updated, encoding="utf-8")
            print(f"refreshed featured projects in {args.readme}")

    if failures:
        annotate("error", "failed: " + ", ".join(failures))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
