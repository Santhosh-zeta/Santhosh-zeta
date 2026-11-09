import { ImageResponse } from "next/og";
import { PROJECTS, SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;
export const generateStaticParams = () => PROJECTS.map((p) => ({ slug: p.slug }));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug) ?? PROJECTS[0];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#050505", color: "#fafafa", border: "1px solid #2b2b2b" }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#6b6b6b" }}>{`${SITE.name.toUpperCase()} / WORK`}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 108, fontWeight: 200, letterSpacing: -3, lineHeight: 1.02 }}>{p.name}</div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 32, color: "#a1a1a1" }}>{p.tagline}</div>
          <div style={{ display: "flex", marginTop: 34, width: 120, height: 3, background: "#fafafa" }} />
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#a1a1a1" }}>{p.tags.slice(0, 4).join("  ·  ")}</div>
      </div>
    ),
    size,
  );
}
