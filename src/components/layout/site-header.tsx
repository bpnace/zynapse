"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryCta, siteNav } from "@/lib/content/site";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-[color:var(--line)] bg-[rgba(8,12,18,0.82)] px-4 py-3 shadow-[0_18px_60px_rgba(1,4,8,0.5)] backdrop-blur-2xl sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] uppercase text-[var(--foreground)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-slate-950">
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
                  "rounded-full px-4 py-2 text-sm text-[color:var(--copy-muted)] hover:text-[var(--foreground)]",
                  active && "bg-white/[0.06] text-[var(--foreground)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm text-[color:var(--copy-muted)] hover:bg-white/[0.05] hover:text-[var(--foreground)] sm:inline-flex">
            Login
          </Link>
          <Link href={primaryCta.href} className={buttonStyles({ size: "md" })}>
            {primaryCta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
