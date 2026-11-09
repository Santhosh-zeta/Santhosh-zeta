# Design & planning

## The idea
A portfolio that feels like an instrument panel rather than a template: **black, white and every grey between**.
Minimal in colour, rich in detail: halftone shading, hairlines, corner registration marks, monospace labels
against a feather-light sans. It is the same visual language as the GitHub profile README, so the two read as one brand.

## Principles
1. **Monochrome with depth.** Only greys (tokens in `globals.css`). Depth comes from shading, scale and contrast, never hue.
2. **One signature moment.** The halftone planet: its light follows your cursor, a ripple runs through the dots,
   satellites orbit. It is canvas-drawn (≈1k dots), pauses off-screen, and renders one still frame for reduced-motion users.
3. **Content first.** Four real projects with true descriptions, written as readable pages, not screenshots.
4. **Fast by default.** Server components everywhere except the few interactive bits (planet, typed line,
   theme toggle, reveal-on-scroll, copy-email). All routes are static. Fonts self-hosted via `geist`.
5. **Accessible.** Skip link, semantic landmarks, one `h1`, visible focus, 4.5:1+ text contrast, reduced-motion respected,
   works without JavaScript (content is server-rendered; animations are enhancements).

## Information architecture
`/` → Hero · 01 About · 02 Stack · 03 Work · 04 Contact
`/projects/<slug>` → summary, what it does, details, next project
Plus: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/llms.txt`, `/llms-full.txt`, social images.

## SEO (classic search)
- Unique `<title>` + meta description per page, canonical URLs, Open Graph + Twitter cards, generated 1200×630 share images.
- Structured data (JSON-LD): `Person`, `WebSite`, `ProfilePage`, `ItemList` on home; `SoftwareSourceCode` + `BreadcrumbList` per project.
- One `h1` per page, descriptive headings, internal links between home and project pages, clean URLs.
- Sitemap + robots; `max-image-preview:large` and `max-snippet:-1` so Google may show rich previews.
- `sameAs` links (GitHub, LinkedIn) tie the entity together for Google's knowledge graph.

## GEO (generative / AI answer engines)
- **`/llms.txt` and `/llms-full.txt`**: concise, citable plain-text profile + project facts.
- **Entity clarity**: the same name, role and claims repeated consistently in visible text, metadata and JSON-LD,
  so a model can answer "Who is Santhosh V?" with confidence.
- **Quotable, factual prose** on About and every project page (what it does, how, with what), with no marketing fluff.
- **Crawlers welcome**: robots.txt explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot.
- Honest caveats kept in the text (e.g. ColdGuard is a research prototype), which models and readers both trust.

## Roadmap ideas
Case-study depth per project (problem → approach → result, screenshots), a writing/notes section, an RSS feed,
Vercel Analytics or Plausible, and a custom domain.

---

## v2 upgrade (content + interaction)

**Content** now comes from the real LinkedIn profile: founding roles (Dropwing Groups, Dropwing Design Studio), AI Club Technical Lead,
Linux Club, 50+ clients, community events, certifications, the Raspberry Pi 5 homelab, RAKSHAK AI, and the updated ColdGuard facts
(12 vaccines, 6 languages, MIT, merged contributors). Private LinkedIn data (analytics, suggestions, third-party names) is deliberately left out.
Every claim on the site traces back to text the owner wrote.

**New sections:** metrics strip with count-up · marquee · What I do · Experience timeline + education + certifications ·
Community & writing · live GitHub activity (greyscale grid, from the nightly `output/data.json`) · "Quick answers" FAQ · printable `/resume`.

**New interactions:** ⌘K / Ctrl+K command palette (jump to sections/projects, open links, copy email, toggle theme) ·
pointer-following spotlight on cards · film-grain overlay · outlined marquee · scroll-progress bar.

**SEO/GEO additions:** `Person` now includes employer, school, memberships, credentials and location; `FAQPage` JSON-LD
(and visible FAQ, which AI engines quote); `/resume` in the sitemap; the FAQ and experience are repeated in `llms-full.txt`.

**Still manual:** set the real domain (`NEXT_PUBLIC_SITE_URL`), Search Console verification, add screenshots to project pages.
