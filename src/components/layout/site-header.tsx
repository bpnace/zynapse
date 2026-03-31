"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import appIcon from "@/app/apple-touch-icon.png";
import { primaryCta, siteNav } from "@/lib/content/site";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/layout/wordmark";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { usePastHero } from "@/hooks/use-past-hero";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isPastHero } = usePastHero();
  const closeMenu = () => setMenuOpen(false);

  const isHomePage = pathname === "/";
  const mobileVisible = menuOpen || !isHomePage || isPastHero;

  return (
    <>
      <header
        className={cn(
          "sticky inset-x-0 top-0 z-50 px-4 pt-4 pb-2 sm:px-6",
          "max-md:motion-safe:transition-[transform,opacity] max-md:motion-safe:duration-300",
          !mobileVisible &&
            "max-md:-translate-y-full max-md:opacity-0 max-md:pointer-events-none",
        )}
      >
        <div className="relative mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[color:var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 shadow-[0_18px_40px_rgba(31,36,48,0.08)] backdrop-blur-2xl sm:px-6 md:grid md:grid-cols-[1fr_auto_1fr] md:justify-normal">
          {/* Left: burger (mobile) / wordmark (desktop) */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Hauptnavigation öffnen"
            className="rounded-[var(--radius-chip)] p-2 text-[color:var(--copy-muted)] hover:bg-[rgba(31,36,48,0.05)] hover:text-[var(--foreground)] md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Wordmark
            className="hidden md:inline-flex md:justify-self-start"
            imageClassName="w-[9rem] sm:w-[9rem]"
            priority
          />

          {/* Center: app icon (mobile) / nav links (desktop) */}
          <Link
            href="/"
            aria-label="Zynapse Startseite"
            onClick={closeMenu}
            className="absolute left-1/2 -translate-x-1/2 md:hidden"
          >
            <Image
              src={appIcon}
              alt="Zynapse"
              width={180}
              height={180}
              className="h-9 w-9 rounded-lg"
              priority
            />
          </Link>
          <nav className="hidden items-center justify-center gap-1 md:flex">
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

          {/* Right: login (desktop) + CTA */}
          <div className="flex items-center gap-2 md:justify-self-end">
            <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm text-[color:var(--copy-muted)] hover:bg-[rgba(31,36,48,0.05)] hover:text-[var(--foreground)] md:inline-flex">
              Registrieren
            </Link>
            <ButtonLink
              href={primaryCta.href}
              onClick={closeMenu}
              size="md"
              hidePrimaryArrows
              className="border-[rgba(224,94,67,0.28)] text-[var(--accent-strong)] font-bold shadow-[0_18px_30px_rgba(224,94,67,0.14)]"
              primaryFillClassName="bg-[linear-gradient(135deg,var(--accent-strong),#f0a84d)]"
            >
              {primaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  );
}
