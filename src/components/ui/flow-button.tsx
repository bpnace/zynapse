"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type FlowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  children?: ReactNode;
  className?: string;
  showArrows?: boolean;
  fillClassName?: string;
};

export const flowButtonClassName =
  "group relative inline-flex cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-[rgba(31,36,48,0.28)] bg-transparent text-[var(--foreground)] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] hover:border-transparent hover:text-white focus-visible:rounded-[12px] focus-visible:border-transparent focus-visible:text-white active:scale-[0.95]";

export function FlowButtonContent({
  children,
  className,
  showArrows = true,
  fillClassName = "bg-[var(--foreground)]",
}: {
  children: ReactNode;
  className?: string;
  showArrows?: boolean;
  fillClassName?: string;
}) {
  return (
    <>
      {showArrows ? (
        <ArrowRight
          aria-hidden="true"
          className="pointer-events-none absolute left-[-25%] z-[9] h-4 w-4 stroke-current transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4 group-focus-visible:left-4 group-hover:stroke-white group-focus-visible:stroke-white"
        />
      ) : null}

      <span
        className={cn(
          "relative z-[1] inline-flex items-center justify-center whitespace-nowrap transition-all duration-[800ms] ease-out",
          showArrows &&
            "-translate-x-3 group-hover:translate-x-3 group-focus-visible:translate-x-3",
          className,
        )}
      >
        {children}
      </span>

      <span
        className={cn(
          "pointer-events-none absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100 group-focus-visible:h-[220px] group-focus-visible:w-[220px] group-focus-visible:opacity-100",
          fillClassName,
        )}
      />

      {showArrows ? (
        <ArrowRight
          aria-hidden="true"
          className="pointer-events-none absolute right-4 z-[9] h-4 w-4 stroke-current transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%] group-focus-visible:right-[-25%] group-hover:stroke-white group-focus-visible:stroke-white"
        />
      ) : null}
    </>
  );
}

export function FlowButton({
  text = "Modern Button",
  children,
  className,
  showArrows = true,
  fillClassName = "bg-[var(--foreground)]",
  type = "button",
  ...props
}: FlowButtonProps) {
  return (
    <button
      type={type}
      className={cn(flowButtonClassName, "px-8 py-3 text-sm font-semibold", className)}
      {...props}
    >
      <FlowButtonContent
        showArrows={showArrows}
        fillClassName={fillClassName}
      >
        {children ?? text}
      </FlowButtonContent>
    </button>
  );
}
