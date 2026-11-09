export default function SectionHead({ index, title, id }: { index: string; title: string; id: string }) {
  return (
    <div className="sec-head">
      <span className="label">{index}</span>
      <h2 className="h2" id={id}>{title}</h2>
    </div>
  );
}
