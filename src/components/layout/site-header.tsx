"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryCta, siteNav } from "@/lib/content/site";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky inset-x-0 top-0 z-50 px-4 pt-4 pb-2 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[color:var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 shadow-[0_18px_40px_rgba(31,36,48,0.08)] backdrop-blur-2xl sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] uppercase text-[var(--foreground)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--ink-strong)] shadow-[0_10px_24px_rgba(246,107,76,0.25)]">
            Z
          </span>
          Zynapse
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {siteNav.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm text-[color:var(--copy-muted)] hover:bg-[rgba(31,36,48,0.05)] hover:text-[var(--foreground)]",
                  active && "bg-[rgba(31,36,48,0.06)] text-[var(--foreground)]",
                )}
              >
                {item.label}
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
