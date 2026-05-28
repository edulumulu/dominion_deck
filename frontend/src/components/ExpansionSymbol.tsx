import { getExpansionSymbolSrc } from "../expansion-symbols";

interface Props {
  name: string;
  className?: string;
}

export function ExpansionSymbol({ name, className = "expansion-symbol" }: Props) {
  const src = getExpansionSymbolSrc(name);
  if (src) {
    return (
      <span className={className}>
        <img src={src} alt={name} className="expansion-symbol-img" />
      </span>
    );
  }
  return (
    <span className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9"/>
      </svg>
    </span>
  );
}
