import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Halftone sphere out of absolutely-positioned dots.
function dots() {
  const out: { x: number; y: number; r: number }[] = [];
  const cx = 930, cy = 315, R = 215, pitch = 15;
  const L = (() => { const v = [-0.55, -0.62, 0.56]; const n = Math.hypot(...v); return v.map((a) => a / n); })();
  for (let row = 0, y = cy - R; y <= cy + R; y += pitch * 0.866, row++) {
    for (let x = cx - R + (row % 2 ? pitch / 2 : 0); x <= cx + R; x += pitch) {
      const nx = (x - cx) / R, ny = (y - cy) / R, d2 = nx * nx + ny * ny;
      if (d2 > 1) continue;
      const b = Math.max(0, nx * L[0] + ny * L[1] + Math.sqrt(1 - d2) * L[2]);
      const r = pitch * 0.5 * (0.14 + 0.86 * Math.pow(b, 1.1));
      if (r > 0.6) out.push({ x, y, r });
    }
  }
  return out;
}

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#050505", color: "#fafafa", position: "relative", fontFamily: "sans-serif" }}>
        {dots().map((d, i) => (
          <div key={i} style={{ position: "absolute", left: d.x - d.r, top: d.y - d.r, width: d.r * 2, height: d.r * 2, borderRadius: 999, background: "#fafafa" }} />
        ))}
        <div style={{ position: "absolute", inset: 28, border: "1px solid #2b2b2b", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", width: 760, height: "100%" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#6b6b6b" }}>{SITE.handle.toUpperCase()}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 128, fontWeight: 200, letterSpacing: -4, lineHeight: 1, textTransform: "uppercase" }}>{SITE.name}</div>
            <div style={{ display: "flex", marginTop: 28, fontSize: 24, letterSpacing: 5, color: "#a1a1a1", textTransform: "uppercase" }}>{SITE.roles.join("  /  ")}</div>
            <div style={{ display: "flex", marginTop: 34, width: 120, height: 3, background: "#fafafa" }} />
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#a1a1a1" }}>{SITE.url.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    ),
    size,
  );
}
