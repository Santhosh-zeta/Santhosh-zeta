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
  address: { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
  sameAs: [SITE.github, SITE.linkedin, SITE.company.url, SITE.medium],
  worksFor: [
    { "@type": "Organization", name: SITE.company.name, url: SITE.company.url },
    { "@type": "Organization", name: "Dropwing Design Studio" },
  ],
  alumniOf: { "@type": "CollegeOrUniversity", name: "Vellore Institute of Technology, Chennai" },
  memberOf: [
    { "@type": "Organization", name: "Artificial Intelligence Club, VIT Chennai" },
    { "@type": "Organization", name: "Linux Club, VIT Chennai" },
  ],
  hasCredential: SITE.certifications.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.title,
    recognizedBy: { "@type": "Organization", name: c.org },
  })),
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
        "@id": id("profilepage"),
        url: SITE.url,
        name: SITE.title,
        isPartOf: { "@id": id("website") },
        mainEntity: { "@id": id("person") },
      },
      {
        "@type": "ItemList",
        name: "Selected work",
        itemListElement: PROJECTS.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: projectUrl(p.slug), name: p.name })),
      },
      {
        "@type": "FAQPage",
        "@id": id("faq"),
        mainEntity: SITE.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ],
  };
}

export function projectGraph(p: Project) {
  const repo = repoUrl(p);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        "@id": `${projectUrl(p.slug)}#code`,
        name: p.name,
        description: p.summary,
        url: projectUrl(p.slug),
        ...(repo ? { codeRepository: repo } : {}),
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
