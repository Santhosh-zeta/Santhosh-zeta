import Link from "next/link";
import { PROJECTS, SITE } from "@/lib/site";
import ThemeToggle from "./ThemeToggle";
import CommandPalette, { type Cmd } from "./CommandPalette";
import PaletteButton from "./PaletteButton";

const LINKS = [["About", "/#about"], ["Work", "/#work"], ["Experience", "/#experience"], ["Activity", "/#activity"], ["Contact", "/#contact"]] as const;

const COMMANDS: Cmd[] = [
  ...[["About", "/#about"], ["What I do", "/#services"], ["Work", "/#work"], ["Experience", "/#experience"], ["Stack", "/#stack"], ["Community & writing", "/#community"], ["GitHub activity", "/#activity"], ["FAQ", "/#faq"], ["Contact", "/#contact"]].map(([label, href]) => ({ id: href, label, hint: "Go to section", group: "Sections", href })),
  ...PROJECTS.map((p) => ({ id: p.slug, label: p.name, hint: p.tagline.slice(0, 44), group: "Projects", href: `/projects/${p.slug}` })),
  { id: "resume", label: "Résumé", hint: "Printable, save as PDF", group: "Links", href: "/resume" },
  { id: "github", label: "GitHub", hint: "Santhosh-zeta", group: "Links", href: SITE.github, external: true },
  { id: "linkedin", label: "LinkedIn", hint: "santhosh---v", group: "Links", href: SITE.linkedin, external: true },
  { id: "dropwing", label: "Dropwing Groups", hint: "dropwinggroups.com", group: "Links", href: SITE.company.url, external: true },
  { id: "email", label: "Send email", hint: SITE.email, group: "Actions", href: `mailto:${SITE.email}` },
  { id: "copy", label: "Copy email address", hint: "To clipboard", group: "Actions", action: "copy-email", email: SITE.email },
  { id: "theme", label: "Toggle light / dark", hint: "Switch theme", group: "Actions", action: "theme" },
];

export default function Header() {
  return (
    <>
      <div className="progress" aria-hidden="true" />
      <header className="nav">
        <div className="wrap nav-in">
          <Link href="/" className="brand" aria-label={`${SITE.name} — home`}>
            <i /> {SITE.handle}
          </Link>
          <nav aria-label="Primary">
            <ul>
              {LINKS.map(([label, href]) => (
                <li key={href}><Link href={href}>{label}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="nav-right">
            <PaletteButton />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <CommandPalette items={COMMANDS} />
    </>
  );
}
