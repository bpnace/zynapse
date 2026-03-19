"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryCta, siteNav } from "@/lib/content/site";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/layout/wordmark";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky inset-x-0 top-0 z-50 px-4 pt-4 pb-2 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[color:var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 shadow-[0_18px_40px_rgba(31,36,48,0.08)] backdrop-blur-2xl sm:px-6">
        <Wordmark className="inline-flex items-center" />
        <nav className="hidden items-center gap-1 md:flex">
          {siteNav.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative px-4 py-2 text-sm text-[color:var(--copy-muted)] transition-colors duration-200 hover:text-[var(--foreground)]",
                  active && "text-[var(--foreground)]",
                )}
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-x-3 bottom-[0.4rem] h-[2px] origin-left rounded-full bg-[var(--accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm text-[color:var(--copy-muted)] hover:bg-[rgba(31,36,48,0.05)] hover:text-[var(--foreground)] sm:inline-flex">
            Anmelden
          </Link>
          <Link href={primaryCta.href} className={buttonStyles({ size: "md" })}>
            {primaryCta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
