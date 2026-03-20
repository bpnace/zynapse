"use client";

import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  ReactNode,
} from "react";
import {
  FlowButtonContent,
  flowButtonClassName,
} from "@/components/ui/flow-button";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

const baseStyles =
  "inline-flex items-center justify-center font-semibold tracking-[-0.02em] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-70";

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    flowButtonClassName,
    "shadow-[0_18px_38px_rgba(31,36,48,0.08)] focus-visible:ring-[rgba(31,36,48,0.12)]",
  ),
  secondary:
    "rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,244,239,0.96))] text-[var(--copy-strong)] shadow-[0_10px_22px_rgba(31,36,48,0.05)] hover:border-[rgba(56,67,84,0.3)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(250,246,240,0.98))] focus-visible:ring-[rgba(56,67,84,0.12)]",
  ghost:
    "rounded-[var(--radius-chip)] text-[var(--foreground)] hover:bg-[rgba(31,36,48,0.04)] focus-visible:ring-[rgba(56,67,84,0.1)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "min-h-11 px-6 py-3 text-sm",
  lg: "min-h-12 px-8 py-3.5 text-base",
};

type SharedButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  hidePrimaryArrows?: boolean;
  primaryFillClassName?: string;
};

function ButtonContent({
  children,
  variant,
  hidePrimaryArrows = false,
  primaryFillClassName,
}: {
  children: ReactNode;
  variant: ButtonVariant;
  hidePrimaryArrows?: boolean;
  primaryFillClassName?: string;
}) {
  if (variant === "primary") {
    return (
      <FlowButtonContent
        showArrows={!hidePrimaryArrows}
        fillClassName={primaryFillClassName}
      >
        {children}
      </FlowButtonContent>
    );
  }

  return (
    <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
      {children}
    </span>
  );
}

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
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

type ButtonLinkProps = Omit<
  ComponentProps<typeof Link>,
  "children" | "className"
> &
  SharedButtonProps;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  hidePrimaryArrows,
  primaryFillClassName,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      <ButtonContent
        variant={variant}
        hidePrimaryArrows={hidePrimaryArrows}
        primaryFillClassName={primaryFillClassName}
      >
        {children}
      </ButtonContent>
    </Link>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & SharedButtonProps;

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  hidePrimaryArrows,
  primaryFillClassName,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      <ButtonContent
        variant={variant}
        hidePrimaryArrows={hidePrimaryArrows}
        primaryFillClassName={primaryFillClassName}
      >
        {children}
      </ButtonContent>
    </button>
  );
}
