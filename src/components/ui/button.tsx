import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "rounded-[var(--radius-panel)] bg-[var(--accent-strong)] text-white shadow-[0_16px_34px_rgba(224,94,67,0.24)] hover:-translate-y-0.5 hover:bg-[#cf543c] focus-visible:ring-[rgba(224,94,67,0.25)]",
  secondary:
    "rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.18)] bg-[rgba(255,255,255,0.92)] text-[var(--foreground)] shadow-[0_8px_20px_rgba(31,36,48,0.05)] hover:-translate-y-0.5 hover:border-[rgba(56,67,84,0.28)] hover:bg-white focus-visible:ring-[rgba(56,67,84,0.12)]",
  ghost:
    "rounded-[var(--radius-chip)] text-[var(--foreground)] hover:bg-[rgba(31,36,48,0.04)] focus-visible:ring-[rgba(56,67,84,0.1)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 py-3 text-sm",
  lg: "min-h-12 px-6 py-3.5 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 font-semibold tracking-[-0.02em] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant,
  size,
  className,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonStyles({ variant, size, className })}>
      {children}
    </Link>
  );
}
