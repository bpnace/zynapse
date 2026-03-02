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
      "border-[rgba(56,67,84,0.14)] bg-[rgba(255,255,255,0.88)] text-[var(--foreground)]",
    accent:
      "border-[rgba(224,94,67,0.16)] bg-[rgba(224,94,67,0.1)] text-[var(--accent-strong)]",
    mint:
      "border-[rgba(49,125,101,0.16)] bg-[rgba(156,244,215,0.18)] text-[#236851]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-chip)] border px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase",
        toneStyles[tone],
      )}
    >
      {children}
    </span>
  );
}
