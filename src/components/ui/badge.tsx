import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "accent" | "mint";
}) {
  const toneStyles = {
    default: "border-[color:var(--line)] bg-white/80 text-[var(--foreground)]",
    accent:
      "border-transparent bg-[rgba(246,107,76,0.14)] text-[var(--accent-soft)]",
    mint: "border-transparent bg-[rgba(156,244,215,0.18)] text-[#317d65]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.14em] uppercase",
        toneStyles[tone],
      )}
    >
      {children}
    </span>
  );
}
