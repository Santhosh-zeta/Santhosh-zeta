import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <span className="label">© {new Date().getFullYear()} {SITE.name} · {SITE.location}</span>
        <span className="label">
          <a href={SITE.github} rel="me noopener">GitHub</a> &nbsp;·&nbsp; <a href={SITE.linkedin} rel="me noopener">LinkedIn</a> &nbsp;·&nbsp;{" "}
          <a href={`mailto:${SITE.email}`}>Email</a> &nbsp;·&nbsp; <a href="/resume">Résumé</a> &nbsp;·&nbsp; <a href="/sitemap.xml">Sitemap</a> &nbsp;·&nbsp; <a href="/llms.txt">llms.txt</a>
        </span>
      </div>
    </footer>
  );
}
