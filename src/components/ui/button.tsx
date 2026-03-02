import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--ink-strong)] shadow-[0_20px_50px_rgba(246,107,76,0.28)] hover:-translate-y-0.5 hover:bg-[#ff7b61]",
  secondary:
    "border border-[color:var(--line-strong)] bg-white/80 text-[var(--foreground)] shadow-[0_10px_25px_rgba(31,36,48,0.06)] hover:-translate-y-0.5 hover:border-[color:rgba(246,107,76,0.35)] hover:bg-white",
  ghost:
    "text-[var(--foreground)] hover:bg-[rgba(31,36,48,0.04)]",
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
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.02em]",
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
