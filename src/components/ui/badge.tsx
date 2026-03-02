import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "accent" | "mint";
}) {
  const toneStyles = {
    default:
      "border-[rgba(56,67,84,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,244,240,0.88))] text-[var(--copy-strong)]",
    accent:
      "border-[rgba(224,94,67,0.18)] bg-[linear-gradient(180deg,rgba(224,94,67,0.12),rgba(240,168,77,0.12))] text-[var(--accent-strong)]",
    mint:
      "border-[rgba(49,125,101,0.16)] bg-[linear-gradient(180deg,rgba(156,244,215,0.22),rgba(156,244,215,0.14))] text-[#236851]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-chip)] border px-2.5 py-1 text-[11px] font-semibold tracking-[0.11em] uppercase",
        toneStyles[tone],
      )}
    >
      {children}
    </span>
  );
}
