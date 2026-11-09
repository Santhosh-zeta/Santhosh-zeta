import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS, SITE } from "@/lib/site";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${SITE.name}: ${SITE.jobTitle}. Experience, education, certifications and selected projects.`,
  alternates: { canonical: "/resume" },
};

export default function Resume() {
  return (
    <article className="resume wrap">
      <div className="no-print resume-bar">
        <Link href="/" className="label">← Back</Link>
        <PrintButton />
      </div>
      <header>
        <h1>{SITE.name}</h1>
        <p className="r-sub">{SITE.jobTitle}</p>
        <p className="r-contact">
          {SITE.location} · <a href={`mailto:${SITE.email}`}>{SITE.email}</a> · <a href={SITE.linkedin}>linkedin.com/in/santhosh---v</a> · <a href={SITE.github}>github.com/{SITE.handle}</a>
        </p>
      </header>

      <section><h2>Summary</h2><p>{SITE.about.slice(0, 2).join(" ")} {SITE.about[2]}</p></section>

      <section>
        <h2>Experience</h2>
        {SITE.experience.map((e) => (
          <div className="r-item" key={e.role + e.org}>
            <div className="r-row"><h3>{e.role} — {e.org}</h3><span>{e.period}</span></div>
            <p>{e.text}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Selected projects</h2>
        <ProjectList />
      </section>

      <section>
        <h2>Education</h2>
        {SITE.education.map((e) => (
          <div className="r-item" key={e.title}><div className="r-row"><h3>{e.title}</h3><span>{e.period}</span></div><p>{e.org}</p></div>
        ))}
      </section>

      <section>
        <h2>Certifications</h2>
        {SITE.certifications.map((c) => (
          <div className="r-item" key={c.title}><div className="r-row"><h3>{c.title}</h3><span>{c.period}</span></div><p>{c.org}</p></div>
        ))}
      </section>

      <section>
        <h2>Skills</h2>
        {SITE.stack.map(([l, items]) => (<p key={l}><b>{l}:</b> {items.join(", ")}</p>))}
      </section>
    </article>
  );
}

function ProjectList() {
  return (
    <>
      {PROJECTS.slice(0, 5).map((p) => (
        <div className="r-item" key={p.slug}>
          <div className="r-row"><h3>{p.name}</h3><span>{p.language}</span></div>
          <p>{p.summary}</p>
        </div>
      ))}
    </>
  );
}
