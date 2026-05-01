const ZYNAPSE_CORE_PATTERN = /(Zynapse(?:\s+|-)Core)/g;
const ZYNAPSE_CORE_MATCH = /^Zynapse(?:\s+|-)Core$/;

export function renderBoldZynapseCore(text: string) {
  const parts = text.split(ZYNAPSE_CORE_PATTERN);

  return parts.map((part, index) =>
    ZYNAPSE_CORE_MATCH.test(part) ? (
      <strong key={`${part}-${index}`} className="font-semibold text-current">
        {part.includes("-") ? "Zynapse-Core" : "Zynapse Core"}
      </strong>
    ) : (
      part
    ),
  );
}

export function BoldZynapseCore({ children }: { children: string }) {
  return <>{renderBoldZynapseCore(children)}</>;
}
