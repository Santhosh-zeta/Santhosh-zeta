/**
 * Single source of truth for the whole site: copy, links, projects.
 * Edit this file to change text. Nothing else needs to be touched.
 *
 * Set NEXT_PUBLIC_SITE_URL in your host (e.g. Vercel) to your real domain.
 */
export const SITE = {
  name: "Santhosh V",
  handle: "Santhosh-zeta",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://santhosh-zeta.vercel.app").replace(/\/$/, ""),
  email: "iamsanthosh2425@gmail.com",
  github: "https://github.com/Santhosh-zeta",
  linkedin: "https://www.linkedin.com/in/santhosh---v/",
  jobTitle: "Full-Stack, ML, Mobile and DevOps Engineer",
  roles: ["Full-Stack", "ML", "Mobile", "DevOps"],
  status: "Open to work",
  // Cycled by the typing animation in the hero (keep each under ~38 characters).
  typing: [
    "Hi, I'm Santhosh.",
    "I build things that ship.",
    "Web, ML, mobile and cloud.",
    "Always shipping, always learning.",
  ],
  title: "Santhosh V — Full-Stack, ML, Mobile & DevOps Engineer",
  description:
    "Santhosh V is a full-stack, ML, mobile and DevOps engineer who builds products end to end. Selected work: ColdGuard (vaccine cold-chain decisions), Clinical Database Intelligence, MAVIRA and the Dropwing Groups website.",
  quote: "I like not staying in one lane.",
  manifest: [
    ["Role", "Full-Stack · ML · Mobile · DevOps"],
    ["Building", "Side projects, end to end"],
    ["Learning", "System design · MLOps"],
    ["Works across", "Web · Data/ML · Mobile · Cloud"],
    ["Open to", "Full-stack, ML and mobile collabs"],
  ] as const,
  about: [
    "Santhosh V is a full-stack, ML, mobile and DevOps engineer. He works across the whole product: React and TypeScript interfaces, Node and Python back ends, machine-learning pipelines, Flutter and Android apps, and Docker, Kubernetes and AWS deployments.",
    "Recent public work includes ColdGuard, an open-source vaccine cold-chain decision tool; Clinical Database Intelligence, a real-time hospital monitoring platform; and MAVIRA, an automated vendor-risk investigation pipeline. He is currently going deeper on system design and MLOps.",
  ],
  stack: [
    ["Web & Full-Stack", ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "HTML", "CSS", "Tailwind"]],
    ["Data & ML", ["Python", "PyTorch", "TensorFlow", "scikit-learn", "pandas", "FastAPI"]],
    ["Mobile", ["Kotlin", "Java", "Flutter", "Dart"]],
    ["Cloud & DevOps", ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Linux", "PostgreSQL", "MongoDB", "Redis", "Git"]],
  ] as const,
} as const;

export type Project = {
  slug: string;
  name: string;
  repo: string;
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
    tagline: "Vaccine cold-chain decisions with uncertainty.",
    summary:
      "ColdGuard is an open-source tool that turns a vaccine temperature log into a clear USE, INVESTIGATE or DISCARD decision, and says how sure it is. It models degradation with Arrhenius kinetics and quantifies uncertainty with Monte Carlo simulation.",
    points: [
      "Temperature log in, USE / INVESTIGATE / DISCARD decision out, with uncertainty attached",
      "Arrhenius kinetics for heat-driven degradation, Monte Carlo for the confidence range",
      "Delivered four ways: command line, web app, REST API with DHIS2 export, and an offline Android app",
      "Android app available in 6 Indian languages",
    ],
    tags: ["Python", "Monte Carlo", "Arrhenius kinetics", "REST API", "DHIS2", "Android", "Offline-first"],
    note: "Research prototype, not a medical device.",
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
    language: "TypeScript",
    tagline: "Four studios. One group.",
    summary:
      "The public website for Dropwing Groups: four studios under one group, covering design, software, automation and marketing.",
    points: [
      "Public-facing site for a group of four studios",
      "Design, Software, Automation and Marketing under one brand",
      "Built with TypeScript",
    ],
    tags: ["TypeScript", "Web", "Branding"],
  },
];

export const projectUrl = (slug: string) => `${SITE.url}/projects/${slug}`;
export const repoUrl = (p: Project) => `https://github.com/${p.repo}`;
