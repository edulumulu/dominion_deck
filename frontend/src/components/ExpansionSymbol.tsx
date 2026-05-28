import { getExpansionSymbol } from "../expansion-symbols";

interface Props {
  name: string;
  className?: string;
}

export function ExpansionSymbol({ name, className = "expansion-symbol" }: Props) {
  return <span className={className}>{getExpansionSymbol(name)}</span>;
}
