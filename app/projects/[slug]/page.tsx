import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, SITE, projectUrl, repoUrl } from "@/lib/site";
import { ld, projectGraph } from "@/lib/jsonld";
import Arrow from "@/components/Arrow";
import Reveal from "@/components/Reveal";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => PROJECTS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { type: "article", url: projectUrl(p.slug), title: `${p.name} — ${SITE.name}`, description: p.summary },
    twitter: { card: "summary_large_image", title: `${p.name} — ${SITE.name}`, description: p.summary },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const i = PROJECTS.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = PROJECTS[i];
  const next = PROJECTS[(i + 1) % PROJECTS.length];

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(projectGraph(p)) }} />
      <header className="proj-hero wrap">
        <Link href="/#work" className="back label">← All work</Link>
        <p className="label" style={{ marginBottom: 18 }}>{String(i + 1).padStart(2, "0")} / {p.language}</p>
        <h1 className="proj-title">{p.name}</h1>
        <p className="lede">{p.tagline}</p>
      </header>

      <div className="wrap">
        <div className="proj-grid">
          <div>
            <Reveal><p className="prose" style={{ fontSize: 19, margin: "0 0 40px" }}><span style={{ color: "var(--muted)" }}>{p.summary}</span></p></Reveal>
            <h2 className="label" style={{ margin: "0 0 18px" }}>What it does</h2>
            <ul className="points">
              {p.points.map((pt, k) => (
                <li key={pt}><span>{String(k + 1).padStart(2, "0")}</span>{pt}</li>
              ))}
            </ul>
            {p.note && <p className="note">⚠ {p.note}</p>}
          </div>
          <aside className="meta ticks" aria-label="Project details">
            <dl style={{ display: "contents" }}>
              <div><dt className="label">Language</dt><dd>{p.language}</dd></div>
              <div><dt className="label">Built with</dt><dd>{p.tags.join(" · ")}</dd></div>
              <div><dt className="label">Author</dt><dd>{SITE.name}</dd></div>
            </dl>
            <a className="btn solid" href={repoUrl(p)} rel="noopener">View source <Arrow size={14} /></a>
          </aside>
        </div>

        <Link href={`/projects/${next.slug}`} className="work next" style={{ gridTemplateColumns: "1fr 40px" }}>
          <div><p className="label" style={{ color: "inherit", opacity: .6, marginBottom: 10 }}>Next project</p><h3>{next.name}</h3></div>
          <Arrow />
        </Link>
      </div>
    </article>
  );
}
