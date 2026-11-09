import { PROJECTS, SITE, projectUrl, repoUrl, type Project } from "./site";

const id = (hash: string) => `${SITE.url}/#${hash}`;

export const person = {
  "@type": "Person",
  "@id": id("person"),
  name: SITE.name,
  alternateName: [SITE.handle, "Santhosh Zeta"],
  url: SITE.url,
  email: `mailto:${SITE.email}`,
  jobTitle: SITE.jobTitle,
  description: SITE.description,
  sameAs: [SITE.github, SITE.linkedin],
  knowsAbout: SITE.stack.flatMap(([, items]) => [...items]),
};

export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": id("website"),
        url: SITE.url,
        name: `${SITE.name} — Portfolio`,
        description: SITE.description,
        inLanguage: "en",
        publisher: { "@id": id("person") },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE.url}/#profilepage`,
        url: SITE.url,
        name: SITE.title,
        isPartOf: { "@id": id("website") },
        mainEntity: { "@id": id("person") },
      },
      {
        "@type": "ItemList",
        name: "Selected work",
        itemListElement: PROJECTS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: projectUrl(p.slug),
          name: p.name,
        })),
      },
    ],
  };
}

export function projectGraph(p: Project) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        "@id": `${projectUrl(p.slug)}#code`,
        name: p.name,
        description: p.summary,
        url: projectUrl(p.slug),
        codeRepository: repoUrl(p),
        programmingLanguage: p.language,
        keywords: p.tags.join(", "),
        author: { "@id": id("person") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Work", item: `${SITE.url}/#work` },
          { "@type": "ListItem", position: 3, name: p.name, item: projectUrl(p.slug) },
        ],
      },
    ],
  };
}

/** Serialise for a <script type="application/ld+json"> tag (escapes "<" so content can't close the tag). */
export const ld = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
