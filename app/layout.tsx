import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SITE } from "@/lib/site";
import { homeGraph, ld } from "@/lib/jsonld";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Spotlight from "@/components/Spotlight";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: `${SITE.name} — Portfolio`,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "Santhosh V", "Santhosh-zeta", "Santhosh V VIT Chennai", "AI automation", "n8n", "full-stack developer",
    "business development", "digital marketing", "Dropwing Groups", "ColdGuard", "Technical Lead AI Club VIT Chennai", "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile", url: SITE.url, siteName: `${SITE.name} — Portfolio`, title: SITE.title,
    description: SITE.description, locale: "en_US", firstName: "Santhosh", lastName: "V", username: SITE.handle,
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "technology",
  // Add your verification codes here after you register the site:
  // verification: { google: "…", other: { "msvalidate.01": "…" } },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#050505" }, { media: "(prefers-color-scheme: light)", color: "#ffffff" }],
  width: "device-width", initialScale: 1,
};

// Runs before first paint: restores saved theme and flags that JS is available (enables reveal animations).
const BOOT = `try{var d=document.documentElement;d.classList.add('js');var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(homeGraph()) }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Spotlight />
        <div className="grain" aria-hidden="true" />
        <Footer />
      </body>
    </html>
  );
}
