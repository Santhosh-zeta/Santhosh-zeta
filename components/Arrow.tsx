export default function Arrow({ size = 18 }: { size?: number }) {
  return (
    <svg className="arrow" width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 14 14 4M6 4h8v8" />
    </svg>
  );
}
