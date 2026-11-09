import Link from "next/link";
import { PROJECTS, SITE } from "@/lib/site";
import Planet from "@/components/Planet";
import Typed from "@/components/Typed";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import Arrow from "@/components/Arrow";
import CopyEmail from "@/components/CopyEmail";

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
          </div>
        </div>
        <span className="scroll-hint label" aria-hidden="true">Scroll</span>
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

      <section className="sec" id="stack" aria-labelledby="stack-h">
        <div className="wrap">
          <SectionHead index="02" title="Stack" id="stack-h" />
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

      <section className="sec" id="work" aria-labelledby="work-h">
        <div className="wrap">
          <SectionHead index="03" title="Work" id="work-h" />
          <div className="works">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.07}>
                <Link href={`/projects/${p.slug}`} className="work">
                  <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{p.name}</h3>
                    <p className="tag">{p.tagline}</p>
                  </div>
                  <div className="col-desc">
                    <p>{p.summary}</p>
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

      <section className="sec" id="contact" aria-labelledby="contact-h">
        <div className="wrap">
          <SectionHead index="04" title="Contact" id="contact-h" />
          <Reveal>
            <div className="contact ticks">
              <p className="big">Let’s build<br />something.</p>
              <p style={{ margin: "0 0 28px" }}><a className="mail" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
              <div className="links">
                <a className="btn solid" href={`mailto:${SITE.email}`}>Email me</a>
                <CopyEmail email={SITE.email} />
                <a className="btn ghost" href={SITE.linkedin} rel="me noopener">LinkedIn <Arrow size={14} /></a>
                <a className="btn ghost" href={SITE.github} rel="me noopener">GitHub <Arrow size={14} /></a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
