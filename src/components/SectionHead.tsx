import { sections } from "../data/profile";
import "./SectionHead.css";

type Props = { index: string; label: string; aside?: string };

/** Exhibit header strip: index · rule · label · position in the case file. */
export default function SectionHead({ index, label, aside }: Props) {
  const total = String(sections.length - 1).padStart(2, "0");
  return (
    <div className="shead" data-reveal="rule">
      <span className="label label--ember">({index})</span>
      <span className="label shead__label">{label}</span>
      <span className="shead__rule" aria-hidden="true" />
      <span className="label shead__aside">{aside ?? `Exhibit ${index} / ${total}`}</span>
    </div>
  );
}
