# Santhosh V — Portfolio (Next.js)

Monochrome, fast, SEO- and GEO-optimised portfolio. Next.js 16 (App Router) · React 19 · TypeScript · plain CSS.
No UI library, no tracking, one tiny client-JS footprint. Every page is statically pre-rendered.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Change the content (no design work needed)

Everything you read on the site lives in **one file: [`lib/site.ts`](lib/site.ts)**: name, links, typed lines,
about text, stack, and the `PROJECTS` list. Add a project there and it automatically gets a card on the home page,
its own page at `/projects/<slug>`, a sitemap entry, a social-share image, JSON-LD and an `llms.txt` entry.

## Deploy (Vercel, free, ~2 minutes)

1. Import this branch on vercel.com → framework is detected as Next.js.
2. Add environment variable `NEXT_PUBLIC_SITE_URL` = your real domain (e.g. `https://santhosh.dev`).
   **This matters:** canonical URLs, sitemap, Open Graph and structured data all derive from it.
3. Deploy. Then follow the checklist in [`docs/SEO-GEO.md`](docs/SEO-GEO.md).

## Where things are

| Path | What |
|------|------|
| `lib/site.ts` | All copy, links, projects |
| `app/page.tsx` | Home page sections |
| `app/projects/[slug]/` | Project pages + per-project share image |
| `app/globals.css` | Entire design system (greys only) |
| `components/Planet.tsx` | The interactive halftone planet (canvas) |
| `lib/jsonld.ts` | Structured data (schema.org) |
| `app/{sitemap,robots,manifest}.ts`, `app/llms*.txt` | Crawler / AI-engine files |
| `docs/DESIGN.md` | The idea, plan and design decisions |

## Ask an AI to change it

> This is a Next.js App Router portfolio. Read `docs/DESIGN.md` and `README.md` first. Text lives in
> `lib/site.ts`; styling in `app/globals.css` (strictly greys via CSS variables, dark + light). Change
> **[what you want]**. Keep it accessible (semantic HTML, focus states, `prefers-reduced-motion`), keep
> client components minimal, keep JSON-LD valid, and run `npm run lint && npm run build` before finishing.
