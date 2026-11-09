"use client";

export default function PrintButton() {
  return <button className="btn solid" style={{ cursor: "pointer" }} onClick={() => window.print()}>Save as PDF</button>;
}
