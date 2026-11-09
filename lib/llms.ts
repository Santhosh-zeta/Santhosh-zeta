import { PROJECTS, SITE, projectUrl, repoUrl } from "./site";

/** Plain-text summary for AI answer engines (the llms.txt convention). */
export function llmsShort(): string {
  return `# ${SITE.name}

> ${SITE.description}

${SITE.name} (GitHub: ${SITE.handle}) is a ${SITE.jobTitle}. ${SITE.status}.

## Pages
- [Home](${SITE.url}): about, tech stack, selected work, contact
${PROJECTS.map((p) => `- [${p.name}](${projectUrl(p.slug)}): ${p.tagline}`).join("\n")}

## Elsewhere
- [GitHub](${SITE.github})
- [LinkedIn](${SITE.linkedin})
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

Focus areas: ${SITE.roles.join(", ")}. Currently learning: system design, MLOps.

## Tech stack
${SITE.stack.map(([l, items]) => `- ${l}: ${items.join(", ")}`).join("\n")}

## Selected work
${PROJECTS.map((p) => `### ${p.name}
URL: ${projectUrl(p.slug)}
Source: ${repoUrl(p)}
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
