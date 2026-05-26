import { getExpansionSymbol } from "../expansion-symbols";

interface Props {
  name: string;
}

export function ExpansionSymbol({ name }: Props) {
  const svg = getExpansionSymbol(name);
  if (!svg) return <span className="expansion-symbol" />;
  return (
    <span
      className="expansion-symbol"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
