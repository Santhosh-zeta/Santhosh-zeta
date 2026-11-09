# Launch checklist (do these once, in order)

- [ ] Deploy and set `NEXT_PUBLIC_SITE_URL` to your real domain, then redeploy.
- [ ] Open `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/opengraph-image`: all should load.
- [ ] **Google Search Console** → add property → verify → submit `sitemap.xml`. (Paste the verification code into `verification` in `app/layout.tsx`.)
- [ ] **Bing Webmaster Tools** → import from Search Console (also feeds ChatGPT search and Copilot).
- [ ] Test structured data: https://search.google.com/test/rich-results and https://validator.schema.org
- [ ] Test the share card: paste the URL into LinkedIn / X / WhatsApp.
- [ ] Run Lighthouse (Chrome DevTools) on mobile; aim for 95+ across the board.
- [ ] Put the URL in: GitHub profile "Website" field, LinkedIn "Contact info", the profile README, every repo's "Website" field.
      Inbound links from your own accounts are the fastest early ranking signal.
- [ ] Use the same name ("Santhosh V") and bio line everywhere so search and AI engines resolve you as one entity.
- [ ] Add real detail to `PROJECTS` in `lib/site.ts` over time (screenshots, outcomes, links to demos). Depth is what ranks.
