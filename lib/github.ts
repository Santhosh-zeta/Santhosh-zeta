/**
 * Live GitHub activity, read from the data.json that the nightly "Profile" workflow already publishes
 * to the `output` branch of the profile repo. No tokens, no third-party API. Fails soft (returns null).
 */
export type Day = { date: string; count: number; level: number };
export type Activity = {
  calendar: Day[];
  last_year_contributions: number;
  current_streak: { length: number };
  longest_streak: { length: number };
  total_commits: number;
  total_prs: number;
  public_repos: number;
  languages: { name: string; percent: number }[];
  generated_at: string;
};

const URL = process.env.ACTIVITY_URL ?? "https://raw.githubusercontent.com/Santhosh-zeta/Santhosh-zeta/output/data.json";

export async function getActivity(): Promise<Activity | null> {
  try {
    const res = await fetch(URL, { next: { revalidate: 43200 } });
    if (!res.ok) return null;
    const d = (await res.json()) as Activity;
    return Array.isArray(d.calendar) && d.calendar.length ? d : null;
  } catch {
    return null;
  }
}
