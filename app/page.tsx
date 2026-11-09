import Link from "next/link";
import { PROJECTS, SITE } from "@/lib/site";
import Planet from "@/components/Planet";
import Typed from "@/components/Typed";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import Arrow from "@/components/Arrow";
import CopyEmail from "@/components/CopyEmail";
import Counter from "@/components/Counter";
import ActivityGrid from "@/components/ActivityGrid";

const clip = (t: string, n: number) => {
  if (t.length <= n) return t;
  const cut = t.slice(0, n);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "") + "…";
};

const MARQUEE = ["AI Automation", "Full-Stack", "Growth", "Infrastructure", "Open Source", "Design"];

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="top">
        <div className="hero-dots" aria-hidden="true" />
        <div className="planet"><Planet /></div>
        <div className="wrap">
          <p className="eyebrow label"><i className="dot" /> {SITE.status}</p>
          <h1 className="h1" id="top">
            Santhosh V<span className="sr-only"> — {SITE.jobTitle}</span>
          </h1>
          <p className="roles">
            {SITE.roles.map((r, i) => (<span key={r}>{i > 0 && <span className="sep" aria-hidden="true">/</span>}{r}</span>))}
          </p>
          <div className="rule" />
          <Typed lines={SITE.typing} />
          <div className="cta">
            <a className="btn solid" href="#work">See my work <Arrow size={14} /></a>
            <a className="btn ghost" href={`mailto:${SITE.email}`}>Get in touch</a>
            <Link className="btn ghost" href="/resume">Résumé</Link>
          </div>
        </div>
        <span className="scroll-hint label" aria-hidden="true">Scroll</span>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div className="marquee-row" key={k}>
              {MARQUEE.map((m) => (<span key={m + k}>{m}<i /></span>))}
            </div>
          ))}
        </div>
      </div>

      <section className="metrics wrap" aria-label="Highlights">
        <dl>
          {SITE.metrics.map((m) => (
            <Reveal key={m.label}>
              <div className="metric spot">
                <dt className="label">{m.label}</dt>
                <dd><b><Counter value={m.value} suffix={m.suffix} /></b><span>{m.sub}</span></dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      <section className="sec" id="about" aria-labelledby="about-h">
        <div className="wrap">
          <SectionHead index="01" title="About" id="about-h" />
          <Reveal>
            <div className="about ticks">
              <div className="manifest">
                <p className="label" style={{ marginBottom: 12 }}>Manifest</p>
                <dl>
                  {SITE.manifest.map(([k, v]) => (
                    <div className="row" key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
                <div className="prose">{SITE.about.map((p) => <p key={p}>{p}</p>)}</div>
              </div>
              <figure className="pull" style={{ margin: 0 }}>
                <div>
                  <p className="label" style={{ marginBottom: 28 }}>Principle</p>
                  <blockquote>{SITE.quote}</blockquote>
                </div>
                <figcaption className="sig label">{SITE.name}</figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sec" id="services" aria-labelledby="services-h">
        <div className="wrap">
          <SectionHead index="02" title="What I do" id="services-h" />
          <div className="services">
            {SITE.services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <article className="service spot">
                  <p className="label">{String(i + 1).padStart(2, "0")}</p>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <ul className="mini">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="work" aria-labelledby="work-h">
        <div className="wrap">
          <SectionHead index="03" title="Work" id="work-h" />
          <div className="works">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <Link href={`/projects/${p.slug}`} className="work">
                  <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{p.name}</h3>
                    <p className="tag">{p.tagline}</p>
                  </div>
                  <div className="col-desc">
                    <p>{clip(p.summary, 200)}</p>
                    <div className="langs">{p.tags.slice(0, 4).map((t) => <span key={t}>{t}</span>)}</div>
                  </div>
                  <Arrow />
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="more label"><a href={`${SITE.github}?tab=repositories`} rel="me noopener">All repositories on GitHub →</a></p>
        </div>
      </section>

      <section className="sec" id="experience" aria-labelledby="experience-h">
        <div className="wrap">
          <SectionHead index="04" title="Experience" id="experience-h" />
          <ol className="timeline">
            {SITE.experience.map((e, i) => (
              <Reveal as="li" key={e.role + e.org} delay={0.04 * (i % 3)} className={`tl${e.current ? " now" : ""}`}>
                <span className="tl-dot" aria-hidden="true" />
                <p className="tl-when label">{e.period}{e.current && <b> · Now</b>}</p>
                <h3>{e.role}</h3>
                <p className="tl-org">{e.org} <span>· {e.kind}</span></p>
                <p className="tl-text">{e.text}</p>
                <ul className="mini">{e.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </Reveal>
            ))}
          </ol>

          <div className="edu">
            <Reveal>
              <div className="edu-col ticks">
                <p className="label">Education</p>
                {SITE.education.map((e) => (
                  <div className="edu-item" key={e.title}><h3>{e.title}</h3><p>{e.org}</p><p className="label">{e.period}</p></div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="edu-col ticks">
                <p className="label">Certifications</p>
                {SITE.certifications.map((e) => (
                  <div className="edu-item" key={e.title}><h3>{e.title}</h3><p>{e.org}</p><p className="label">{e.period}</p></div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec" id="stack" aria-labelledby="stack-h">
        <div className="wrap">
          <SectionHead index="05" title="Stack" id="stack-h" />
          <Reveal>
            <div className="stack ticks">
              {SITE.stack.map(([label, items], i) => (
                <div className="group" key={label}>
                  <h3><span>{String(i + 1).padStart(2, "0")}</span>{label}</h3>
                  <ul className="chips">{items.map((it) => <li key={it}>{it}</li>)}</ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sec" id="community" aria-labelledby="community-h">
        <div className="wrap">
          <SectionHead index="06" title="Community & writing" id="community-h" />
          <div className="events">
            {SITE.community.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <article className="event spot">
                  <p className="label">{c.kind}</p>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          {SITE.writing.map((w) => (
            <Reveal key={w.title}>
              <a className="article work" href={w.href} rel="noopener" target="_blank">
                <span className="idx">{w.meta}</span>
                <div><h3>{w.title}</h3><p className="tag">{w.tags.join(" · ")}</p></div>
                <div className="col-desc"><p>{w.text}</p></div>
                <Arrow />
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec" id="activity" aria-labelledby="activity-h">
        <div className="wrap">
          <SectionHead index="07" title="Activity" id="activity-h" />
          <Reveal><ActivityGrid /></Reveal>
        </div>
      </section>

      <section className="sec" id="faq" aria-labelledby="faq-h">
        <div className="wrap">
          <SectionHead index="08" title="Quick answers" id="faq-h" />
          <div className="faq">
            {SITE.faq.map(([q, a], i) => (
              <Reveal key={q} delay={0.03 * i}>
                <details className="qa" open={i === 0}>
                  <summary><span>{q}</span><i aria-hidden="true" /></summary>
                  <p>{a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="contact" aria-labelledby="contact-h">
        <div className="wrap">
          <SectionHead index="09" title="Contact" id="contact-h" />
          <Reveal>
            <div className="contact ticks">
              <p className="big">Let’s build<br />something.</p>
              <p style={{ margin: "0 0 12px" }}><a className="mail" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
              <p className="label" style={{ marginBottom: 28 }}>{SITE.status} · Partnerships · Strategy · Operations · Product marketing</p>
              <div className="links">
                <a className="btn solid" href={`mailto:${SITE.email}`}>Email me</a>
                <CopyEmail email={SITE.email} />
                <a className="btn ghost" href={SITE.linkedin} rel="me noopener">LinkedIn <Arrow size={14} /></a>
                <a className="btn ghost" href={SITE.github} rel="me noopener">GitHub <Arrow size={14} /></a>
                <Link className="btn ghost" href="/resume">Résumé</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
