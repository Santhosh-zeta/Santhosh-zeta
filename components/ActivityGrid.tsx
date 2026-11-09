import { getActivity } from "@/lib/github";
import { SITE } from "@/lib/site";

const LEVEL = ["var(--g0)", "var(--g1)", "var(--g2)", "var(--g3)", "var(--g4)"];

/** Greyscale contribution grid + figures, from the nightly-published data.json. Falls back to a link if unavailable. */
export default async function ActivityGrid() {
  const a = await getActivity();
  if (!a) {
    return (
      <div className="activity ticks">
        <p className="label">Contributions</p>
        <p style={{ margin: "14px 0 20px", color: "var(--muted)" }}>My live contribution graph and language breakdown are on GitHub.</p>
        <a className="btn ghost" href={SITE.github} rel="me noopener">Open @{SITE.handle} on GitHub</a>
      </div>
    );
  }
  const cal = a.calendar;
  const offset = (new Date(cal[0].date + "T00:00:00Z").getUTCDay()) % 7;
  const cells: (null | (typeof cal)[number])[] = [...Array(offset).fill(null), ...cal];
  const weeks = Math.ceil(cells.length / 7);
  const active = cal.filter((d) => d.count > 0).length;
  const best = cal.reduce((m, d) => (d.count > m.count ? d : m), cal[0]);
  const langs = a.languages.slice(0, 6);

  const figs: [string, string, string][] = [
    ["Contributions", a.last_year_contributions.toLocaleString("en-US"), "last 12 months"],
    ["Active days", String(active), `of ${cal.length}`],
    ["Longest streak", String(a.longest_streak.length), a.longest_streak.length === 1 ? "day" : "days"],
    ["Public repos", String(a.public_repos), "on GitHub"],
  ];

  return (
    <div className="activity ticks">
      <div className="act-head">
        <p className="label">Contributions · last 12 months</p>
        <a className="label link" href={SITE.github} rel="me noopener">@{SITE.handle} →</a>
      </div>
      <div className="grid-scroll">
        <div className="heat" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }} role="img" aria-label={`${a.last_year_contributions} contributions on GitHub in the last year`}>
          {cells.map((d, i) => (
            <i key={i} style={{ background: d ? LEVEL[d.level] : "transparent", animationDelay: `${(Math.floor(i / 7) * 14 + (i % 7) * 6)}ms` }} title={d ? `${d.count} on ${d.date}` : undefined} />
          ))}
        </div>
      </div>
      <dl className="figs">
        {figs.map(([k, v, sub]) => (
          <div key={k}><dt className="label">{k}</dt><dd><b>{v}</b> <span>{sub}</span></dd></div>
        ))}
      </dl>
      {langs.length > 0 && (
        <div className="langs-bar" aria-label="Languages">
          <div className="bar">
            {langs.map((l, i) => <span key={l.name} style={{ flexGrow: l.percent, background: `var(--g${Math.max(1, 4 - i)})`, opacity: i > 3 ? 0.5 : 1 }} />)}
          </div>
          <ul>
            {langs.map((l, i) => (
              <li key={l.name}><i style={{ background: `var(--g${Math.max(1, 4 - i)})`, opacity: i > 3 ? 0.5 : 1 }} />{l.name} <span>{l.percent.toFixed(1)}%</span></li>
            ))}
          </ul>
        </div>
      )}
      <p className="label upd">Updated {a.generated_at.slice(0, 10)} · from the nightly profile build</p>
    </div>
  );
}
