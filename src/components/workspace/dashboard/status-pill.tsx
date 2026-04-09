import { cn } from "@/lib/utils";

type StatusPillProps = {
  value: string;
  tone?: "neutral" | "accent";
};

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function StatusPill({
  value,
  tone = "neutral",
}: StatusPillProps) {
  const normalized = value.toLowerCase();

  const toneClassName =
    normalized === "approved" || normalized === "completed"
      ? "workspace-status-success"
      : normalized === "changes_requested" || normalized === "pending"
        ? "workspace-status-warning"
        : tone === "accent"
          ? "workspace-status-accent"
          : "";

  return (
    <span className={cn("workspace-status", toneClassName)}>
      {formatLabel(value)}
    </span>
  );
}
