import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "rounded-[var(--radius-panel)] border border-[rgba(255,255,255,0.18)] bg-[linear-gradient(135deg,var(--accent-strong),#f07a57)] text-white shadow-[0_18px_38px_rgba(224,94,67,0.26)] hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#cf543c,#eb7854)] focus-visible:ring-[rgba(224,94,67,0.25)]",
  secondary:
    "rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,244,239,0.96))] text-[var(--copy-strong)] shadow-[0_10px_22px_rgba(31,36,48,0.05)] hover:-translate-y-0.5 hover:border-[rgba(56,67,84,0.3)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(250,246,240,0.98))] focus-visible:ring-[rgba(56,67,84,0.12)]",
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
