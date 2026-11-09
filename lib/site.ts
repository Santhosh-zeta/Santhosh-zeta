/**
 * Single source of truth for the whole site: copy, links, projects, experience.
 * Edit this file to change text. Nothing else needs to be touched.
 *
 * Set NEXT_PUBLIC_SITE_URL in your host (Vercel) to your real domain.
 */
export const SITE = {
  name: "Santhosh V",
  handle: "Santhosh-zeta",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.santhoshv.xyz").replace(/\/$/, ""),
  email: "iamsanthosh2425@gmail.com",
  github: "https://github.com/Santhosh-zeta",
  linkedin: "https://www.linkedin.com/in/santhosh---v/",
  medium: "https://medium.com/p/turning-a-single-domain-into-a-personal-developer-platform-2373e287210b",
  company: { name: "Dropwing Groups", url: "https://www.dropwinggroups.com" },
  location: "Chennai, Tamil Nadu, India",
  jobTitle: "Full-Stack Developer, AI Automation Builder and Technical Lead",
  headline: "AI automation · Full-stack · Business development",
  roles: ["AI Automation", "Full-Stack", "Growth", "Infrastructure"],
  status: "Open to internships",
  // Cycled by the typing animation in the hero (keep each under ~38 characters).
  typing: [
    "Hi, I'm Santhosh.",
    "I build, ship and sell.",
    "AI automation, full-stack, growth.",
    "Technical Lead @ AI Club, VIT Chennai",
  ],
  title: "Santhosh V — AI Automation, Full-Stack & Growth | VIT Chennai",
  description:
    "Santhosh V is a computer science student at VIT Chennai, Technical Lead of the AI Club and founding team member of Dropwing Groups. He builds AI automation, full-stack products and infrastructure, and has worked with 50+ clients. Creator of ColdGuard, an open-source vaccine cold-chain tool.",
  quote: "I like not staying in one lane.",
  manifest: [
    ["Based in", "Chennai, India"],
    ["Studying", "B.Tech CSE (Cyber Physical Systems) · VIT · 2028"],
    ["Leading", "Technical Lead, AI Club VIT Chennai"],
    ["Founding", "Dropwing Groups · Dropwing Design Studio"],
    ["Works across", "AI automation · Full-stack · Infrastructure"],
    ["Open to", "Internships: partnerships, strategy, ops, product marketing"],
  ] as const,
  about: [
    "Santhosh V is a computer science student at VIT Chennai (B.Tech CSE, Cyber Physical Systems, class of 2028) on the founding team of two student-led ventures, Dropwing Groups and Dropwing Design Studio, which he started to learn how industry really works.",
    "He has worked with 50+ clients across digital marketing, design and AI automation: finding them, understanding what they need and delivering it. As Technical Lead of the AI Club at VIT Chennai he runs projects and workshops, including a hands-on session on building AI agents with n8n.",
    "On the build side he ships full-stack products and runs his own infrastructure: ColdGuard, an open-source vaccine cold-chain decision tool, and a self-hosted Raspberry Pi 5 homelab. He is looking for internships in partnerships, strategy, operations or product marketing at AI and tech companies.",
  ],
  metrics: [
    { value: 50, suffix: "+", label: "Clients served", sub: "marketing · design · automation" },
    { value: 12, suffix: "", label: "Vaccines modelled", sub: "in ColdGuard" },
    { value: 6, suffix: "", label: "App languages", sub: "ColdGuard on Android" },
    { value: 9, suffix: "", label: "Merged contributors", sub: "open-source community" },
  ],
  services: [
    {
      title: "AI Automation",
      text: "AI agents and n8n workflows that remove manual follow-up. Designed visually, deployed for real use, and taught to others in live sessions.",
      tags: ["n8n", "AI agents", "Workflows"],
    },
    {
      title: "Digital Marketing & Growth",
      text: "Meta Ads campaigns, cold outreach and channel analysis. Finding clients, pitching them and tracking what works, from first call to delivery.",
      tags: ["Meta Ads", "Outreach", "Analytics"],
    },
    {
      title: "Design & Brand",
      text: "Brand identities, marketing creatives and digital assets for small businesses, scoped with the client and delivered through Dropwing Design Studio.",
      tags: ["Brand identity", "Creatives", "Logo design"],
    },
    {
      title: "Software & Infrastructure",
      text: "Full-stack web, APIs and internal platforms, deployed on Linux and Docker, with self-hosted services behind Cloudflare Zero Trust.",
      tags: ["Full-stack", "Docker", "Linux"],
    },
  ],
  stack: [
    ["AI & Automation", ["n8n", "AI agents", "Python", "Ollama", "Open WebUI", "Prompt design"]],
    ["Web & Mobile", ["TypeScript", "JavaScript", "React", "Next.js", "Node.js", "React Native", "Flutter", "Dart", "Tailwind"]],
    ["Data & Infrastructure", ["PostgreSQL", "TimescaleDB", "Docker", "Linux", "Cloudflare Zero Trust", "Raspberry Pi", "GitHub Actions", "Vercel"]],
    ["Growth & Design", ["Meta Ads", "Cold outreach", "Spreadsheet analytics", "Brand identity", "Graphic design", "Product marketing"]],
  ] as const,
  experience: [
    {
      role: "Founding Team",
      org: "Dropwing Groups",
      kind: "Part-time · Hybrid",
      period: "Jan 2025 — Present",
      current: true,
      text: "Student-led venture offering digital marketing, design and AI automation. Works with clients end to end: finding and pitching them, understanding requirements and handing work to the design, tech and marketing teams. 50+ clients so far. Day to day: running Meta Ads campaigns and cold outreach, analysing channel performance in spreadsheets, and building n8n workflows that cut manual follow-up.",
      tags: ["Business development", "Meta Ads", "n8n", "Client delivery"],
    },
    {
      role: "Technical Lead",
      org: "Artificial Intelligence Club, VIT Chennai",
      kind: "Full-time",
      period: "Sep 2025 — Present",
      current: true,
      text: "Oversees the technical direction of the club's projects and workshops in AI and emerging technologies: guiding members to build practical AI solutions, organising technical sessions and designing projects in machine learning, automation and intelligent systems.",
      tags: ["Leadership", "AI", "Workshops", "Web development"],
    },
    {
      role: "Founding Team",
      org: "Dropwing Design Studio",
      kind: "Part-time · Hybrid",
      period: "Dec 2023 — Present",
      current: true,
      text: "The creative arm of Dropwing Groups, where it all started. Builds brand identities, marketing creatives and digital assets for small businesses and individuals. Handles the client side: understanding the brief, scoping the work, coordinating designers and making sure the final output is what the client needs.",
      tags: ["Brand identity", "Graphic design", "Client management"],
    },
    {
      role: "Management Team Member",
      org: "Linux Club, VIT Chennai",
      kind: "Full-time",
      period: "Sep 2025 — Aug 2026",
      current: false,
      text: "Part of the management team of the Linux Club at VIT Chennai, after a year on its marketing team.",
      tags: ["Community", "Operations"],
    },
    {
      role: "Technical Team Member",
      org: "Artificial Intelligence Club, VIT Chennai",
      kind: "Full-time",
      period: "Feb 2025 — Oct 2025",
      current: false,
      text: "Contributed to technical projects and supported workshops and learning sessions in AI, exploring machine learning, automation and intelligent systems through hands-on work.",
      tags: ["AI", "Public speaking", "Workshops"],
    },
    {
      role: "Marketing Team Member",
      org: "Linux Club, VIT Chennai",
      kind: "Full-time",
      period: "Sep 2024 — Oct 2025",
      current: false,
      text: "Member of the marketing team of the Linux Club at VIT Chennai.",
      tags: ["Digital marketing", "Online marketing"],
    },
  ],
  education: [
    { title: "B.Tech, Computer Science & Engineering (Cyber Physical Systems)", org: "Vellore Institute of Technology (VIT), Chennai", period: "2024 — 2028" },
    { title: "Senior Secondary, Computer Science (Grade A)", org: "Maharishi Vidya Mandir Senior Secondary School", period: "2019 — 2024" },
  ],
  certifications: [
    { title: "Certified Cybersecurity Educator Professional (CCEP)", org: "Red Team Leaders", period: "Issued Nov 2025" },
    { title: "Android Hacking", org: "Cyvigilant", period: "Issued Oct 2024" },
  ],
  community: [
    {
      title: "AI Agents 101",
      kind: "Workshop speaker",
      text: "Led the No-Code AI Agents session at the AI Club's AI Agents 101: building and deploying real-world agents with n8n, with live workflows and practical automation use cases.",
    },
    {
      title: "AI-HEIST CTF",
      kind: "Platform & infrastructure",
      text: "Built the website and platform that ran the AI Club's capture-the-flag live, and kept it stable while participants solved challenges under real load.",
    },
    {
      title: "BRAINWARE",
      kind: "Student coordinator",
      text: "Co-coordinated a KBC-style quiz event for the AI Club with a team of volunteers.",
    },
    {
      title: "Guest lecture host",
      kind: "Host & coordinator",
      text: "Hosted a guest lecture on interconnect networks and the physical constraints of intra-chip communication in high-performance computing chips, delivered by a GPU design engineer from Apple.",
    },
  ],
  writing: [
    {
      title: "Turning a Single Domain into a Personal Developer Platform",
      text: "How one domain can run a small multi-service developer platform: wildcard subdomains for frontends, dedicated backend APIs, CDN-powered assets and centralised DNS, using Cloudflare, Vercel, Render and Hostinger.",
      href: "https://medium.com/p/turning-a-single-domain-into-a-personal-developer-platform-2373e287210b",
      meta: "Medium",
      tags: ["Cloudflare", "Vercel", "Architecture"],
    },
  ],
  faq: [
    ["Who is Santhosh V?", "Santhosh V is a computer science student at VIT Chennai (B.Tech CSE, Cyber Physical Systems, class of 2028), Technical Lead of the Artificial Intelligence Club at VIT Chennai, and a founding team member of Dropwing Groups and Dropwing Design Studio. He builds AI automation, full-stack software and infrastructure."],
    ["What does Santhosh V work on?", "AI automation with n8n and AI agents, full-stack web and mobile products, self-hosted infrastructure on Linux and Docker, and digital marketing and business development for clients. He has worked with 50+ clients through Dropwing Groups."],
    ["What is ColdGuard?", "ColdGuard is an open-source tool created by Santhosh V that turns a vaccine temperature log into a USE, INVESTIGATE or DISCARD decision with uncertainty, using Arrhenius kinetics and Monte Carlo simulation. It covers 12 vaccines from India's immunisation programme and ships as a web app, command-line tool, REST API with DHIS2 export, and an offline Android app in six languages. It is a research prototype, not a medical device."],
    ["Is Santhosh V open to work?", "Yes. He is looking for internships in partnerships, strategy, operations or product marketing at AI and tech companies, and is open to collaborations on full-stack and AI automation projects."],
    ["How can I contact Santhosh V?", "By email at iamsanthosh2425@gmail.com, on LinkedIn at linkedin.com/in/santhosh---v, or on GitHub at github.com/Santhosh-zeta."],
  ] as const,
} as const;

export type Project = {
  slug: string;
  name: string;
  repo?: string; // "owner/name" on GitHub, if public
  site?: string;
  language: string;
  tagline: string;
  summary: string;
  points: string[];
  tags: string[];
  note?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "coldguard",
    name: "ColdGuard",
    repo: "Santhosh-zeta/ColdGuard",
    language: "Python",
    tagline: "Is the vaccine still good? A calibrated answer for the field.",
    summary:
      "A power cut hits the clinic and the fridge was warm for nine hours. Can the vaccines still be used? ColdGuard turns a temperature log into a USE, INVESTIGATE or DISCARD decision and shows how sure it is. It models how heat degrades each vaccine with Arrhenius kinetics and runs thousands of Monte Carlo simulations to quantify the uncertainty.",
    points: [
      "Covers 12 vaccines from India's immunisation programme, with WHO-verified parameters",
      "Temperature log in, USE / INVESTIGATE / DISCARD out, with the uncertainty shown",
      "Four ways to use it: web app, command-line tool, REST API with DHIS2 export, and an offline Android app",
      "Android app in 6 languages: English, Hindi, Tamil, Bengali, Telugu and Kannada",
      "Open source (MIT) with CI, unit tests, contributor docs and 30+ good-first-issues; nine contributors have had pull requests merged",
      "Known weaknesses are filed as public issues, so limitations are visible",
    ],
    tags: ["Python", "Monte Carlo", "Arrhenius kinetics", "React Native", "REST API", "DHIS2", "Open source"],
    note: "Research prototype, not a certified medical device. Part of the validation data is still synthetic, and real published stability data is being sought.",
  },
  {
    slug: "clinical-database-intelligence",
    name: "Clinical Database Intelligence",
    repo: "Santhosh-zeta/Clinical-Database-Intelligence",
    language: "TypeScript",
    tagline: "Real-time hospital intelligence on TimescaleDB.",
    summary:
      "A production-grade hospital intelligence platform. Patient vitals land in TimescaleDB hypertables, are scored with the NEWS2 early-warning system, and push real-time alerts to clinicians.",
    points: [
      "TimescaleDB hypertables for high-volume vitals time series",
      "NEWS2 early-warning scoring on incoming vitals",
      "PostgreSQL NOTIFY to Socket.io for real-time alerting",
      "OLS trend detection, role-based access control and multi-tenancy",
      "Markov-chain vitals simulator for realistic test data",
    ],
    tags: ["TypeScript", "TimescaleDB", "PostgreSQL", "Socket.io", "NEWS2", "RBAC", "Multi-tenancy"],
  },
  {
    slug: "raspberry-pi-homelab",
    name: "Raspberry Pi 5 Homelab",
    language: "Infrastructure",
    tagline: "A production-style self-hosted platform, documented end to end.",
    summary:
      "A complete self-hosted platform built from scratch on a Raspberry Pi 5, from OS install and networking to storage, routing, monitoring and local AI. Every major step is written up in a 10-page Homelab Architecture & Operations Handbook that doubles as a reproducible reference for self-hosting.",
    points: [
      "Docker and Docker Compose as the service backbone, managed with Portainer and Dockge",
      "Cloudflare Zero Trust tunnels to expose self-hosted services securely",
      "Observability: Uptime Kuma for uptime, Beszel for system metrics, Watchtower for automatic updates",
      "Local AI with Ollama and Open WebUI, plus a Homepage dashboard and File Browser",
      "3 TB external storage architecture",
      "Documented in a handbook covering networking, storage, routing, security, troubleshooting and a roadmap",
    ],
    tags: ["Linux", "Docker", "Cloudflare Zero Trust", "Ollama", "Uptime Kuma", "Raspberry Pi 5"],
  },
  {
    slug: "rakshak-ai",
    name: "RAKSHAK AI",
    repo: "Dropwing-Groups/RAKSHAK-AI",
    language: "Python",
    tagline: "From passive CCTV to active cargo-theft intelligence.",
    summary:
      "A hackathon project built with a team: an AI cargo-security platform that helps logistics companies detect and prevent cargo theft in real time, turning surveillance from passive recording into an active intelligence system.",
    points: [
      "Computer vision on live camera feeds to track suspicious activity around cargo vehicles",
      "GPS, IoT sensors and route intelligence combined for full-picture monitoring",
      "Multi-agent AI architecture that analyses each threat from different perspectives",
      "Real-time risk scores, instant alerts and explainable incident reports for security teams",
    ],
    tags: ["Python", "FastAPI", "YOLOv8", "DeepSORT", "Isolation Forest", "PostgreSQL", "Redis", "LangGraph"],
  },
  {
    slug: "mavira",
    name: "MAVIRA",
    repo: "Santhosh-zeta/MAVIRA",
    language: "Python",
    tagline: "Automated vendor-risk investigation.",
    summary:
      "MAVIRA reads a financial institution's vendor inventory workbook, decides how deeply each vendor should be investigated based on criticality, collects OSINT evidence from public web pages, and runs a fully deterministic pipeline to reach its answers.",
    points: [
      "Input is the institution's own vendor inventory workbook",
      "Investigation depth is set automatically from each vendor's criticality",
      "Evidence is collected from public web pages (OSINT)",
      "A fully deterministic pipeline, so the same inputs give the same answers",
    ],
    tags: ["Python", "OSINT", "Vendor risk", "Deterministic pipeline"],
  },
  {
    slug: "dropwing-groups",
    name: "Dropwing Groups",
    repo: "Santhosh-zeta/Dropwing_Groups-Public_Website",
    site: "https://www.dropwinggroups.com",
    language: "TypeScript",
    tagline: "Four studios. One group.",
    summary:
      "The public website of Dropwing Groups, the student-led venture Santhosh co-founded: four studios under one group covering design, software, automation and marketing, with 50+ clients served.",
    points: [
      "Public-facing site for a group of four studios",
      "Design, Software, Automation and Marketing under one brand",
      "Built with TypeScript; the venture itself offers digital marketing, design and AI automation",
    ],
    tags: ["TypeScript", "Web", "Branding"],
  },
];

export const projectUrl = (slug: string) => `${SITE.url}/projects/${slug}`;
export const repoUrl = (p: Project) => (p.repo ? `https://github.com/${p.repo}` : undefined);
