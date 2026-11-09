import { PROJECTS, SITE, projectUrl, repoUrl } from "./site";

/** Plain-text summary for AI answer engines (the llms.txt convention). */
export function llmsShort(): string {
  return `# ${SITE.name}

> ${SITE.description}

${SITE.name} (GitHub: ${SITE.handle}) is based in ${SITE.location}. ${SITE.status}.

## Pages
- [Home](${SITE.url}): about, what he does, work, experience, stack, GitHub activity, FAQ, contact
- [Résumé](${SITE.url}/resume): printable one-page résumé
${PROJECTS.map((p) => `- [${p.name}](${projectUrl(p.slug)}): ${p.tagline}`).join("\n")}

## Elsewhere
- [GitHub](${SITE.github})
- [LinkedIn](${SITE.linkedin})
- [Dropwing Groups](${SITE.company.url})
- Email: ${SITE.email}

## Full text
- [llms-full.txt](${SITE.url}/llms-full.txt)
`;
}

export function llmsFull(): string {
  return `# ${SITE.name}

${SITE.description}

## About
${SITE.about.join("\n\n")}

## Questions and answers
${SITE.faq.map(([q, a]) => `Q: ${q}\nA: ${a}`).join("\n\n")}

## What he does
${SITE.services.map((s) => `- ${s.title}: ${s.text}`).join("\n")}

## Experience
${SITE.experience.map((e) => `- ${e.role}, ${e.org} (${e.period}): ${e.text}`).join("\n")}

## Education
${SITE.education.map((e) => `- ${e.title}, ${e.org} (${e.period})`).join("\n")}

## Certifications
${SITE.certifications.map((c) => `- ${c.title}, ${c.org} (${c.period})`).join("\n")}

## Community and events
${SITE.community.map((c) => `- ${c.title} (${c.kind}): ${c.text}`).join("\n")}

## Writing
${SITE.writing.map((w) => `- ${w.title} (${w.meta}): ${w.href}\n  ${w.text}`).join("\n")}

## Tech stack
${SITE.stack.map(([l, items]) => `- ${l}: ${items.join(", ")}`).join("\n")}

## Selected work
${PROJECTS.map((p) => `### ${p.name}
URL: ${projectUrl(p.slug)}${repoUrl(p) ? `\nSource: ${repoUrl(p)}` : ""}${p.site ? `\nSite: ${p.site}` : ""}
Language: ${p.language}
${p.summary}
${p.points.map((x) => `- ${x}`).join("\n")}
Tags: ${p.tags.join(", ")}${p.note ? `\nNote: ${p.note}` : ""}
`).join("\n")}
## Contact
- Email: ${SITE.email}
- GitHub: ${SITE.github}
- LinkedIn: ${SITE.linkedin}
`;
}
