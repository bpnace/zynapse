import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type WaitlistLinkProps = Omit<ComponentProps<typeof Link>, "children" | "href">;

const buttonBaseClassName =
  "inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-[0.45rem] border px-3.5 py-2 text-xs font-semibold tracking-normal transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2";

const buttonToneClassName = {
  light:
    "border-[rgba(56,67,84,0.18)] bg-white/90 text-[var(--copy-strong)] shadow-[0_8px_18px_rgba(31,36,48,0.05)] hover:border-[rgba(56,67,84,0.32)] hover:bg-white focus-visible:ring-[rgba(56,67,84,0.14)] focus-visible:ring-offset-[var(--background)]",
  dark:
    "border-white/20 bg-white/10 text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:border-white/35 hover:bg-white/15 focus-visible:ring-white/25 focus-visible:ring-offset-[#1d1d1d]",
} as const;

type WaitlistButtonProps = WaitlistLinkProps & {
  tone?: keyof typeof buttonToneClassName;
};

export function WaitlistButton({
  className,
  tone = "light",
  ...props
}: WaitlistButtonProps) {
  return (
    <Link
      href="/login"
      className={cn(buttonBaseClassName, buttonToneClassName[tone], className)}
      {...props}
    >
      Warteliste beitreten
    </Link>
  );
}

export function WaitlistTextLink({ className, ...props }: WaitlistLinkProps) {
  return (
    <Link
      href="/login"
      className={cn(
        "inline-flex items-center text-sm font-semibold tracking-normal text-[var(--copy-strong)] underline decoration-[rgba(224,94,67,0.45)] decoration-2 underline-offset-4 transition-colors duration-200 hover:text-[rgb(185,69,45)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgba(224,94,67,0.24)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        className,
      )}
      {...props}
    >
      Warteliste beitreten
    </Link>
  );
}
