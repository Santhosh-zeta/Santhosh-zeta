import Link from "next/link";
import { SITE } from "@/lib/site";
import ThemeToggle from "./ThemeToggle";

const LINKS = [["About", "/#about"], ["Stack", "/#stack"], ["Work", "/#work"], ["Contact", "/#contact"]] as const;

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
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
