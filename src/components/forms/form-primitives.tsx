import { cn } from "@/lib/utils";

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field-shell">
      <span className="field-label">{label}</span>
      {children}
      {hint ? (
        <span className="text-sm text-[color:var(--copy-muted)]">{hint}</span>
      ) : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input {...props} className={cn("field-input", props.className)} />;
}

export function SelectInput(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  return <select {...props} className={cn("field-input", props.className)} />;
}

export function TextareaInput(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={cn("field-input min-h-32 resize-y", props.className)}
    />
  );
}

export function CheckboxPill({
  checked,
  children,
  onClick,
}: {
  checked: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium",
        checked
          ? "border-[rgba(224,94,67,0.28)] bg-[rgba(246,107,76,0.12)] text-[var(--accent-strong)]"
          : "border-[color:var(--line)] bg-white/[0.04] text-[var(--foreground)] hover:border-[color:var(--line-strong)]",
      )}
    >
      {children}
    </button>
  );
}
