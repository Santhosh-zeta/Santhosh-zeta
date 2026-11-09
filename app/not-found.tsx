import Link from "next/link";

export default function NotFound() {
  return (
    <section className="proj-hero wrap">
      <p className="label">404</p>
      <h1 className="proj-title">Lost in space.</h1>
      <p className="lede">That page doesn’t exist.</p>
      <p style={{ marginTop: 32 }}><Link className="btn solid" href="/">Back home</Link></p>
    </section>
  );
}
