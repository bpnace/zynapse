"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { siteNav } from "@/lib/content/site";
import { Wordmark } from "@/components/layout/wordmark";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        id="mobile-menu"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(20rem,85vw)] border-r border-[color:var(--line)] bg-[rgba(255,252,248,0.98)] shadow-[4px_0_24px_rgba(31,36,48,0.1)] backdrop-blur-xl motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Mobile Navigation"
        role="navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <Wordmark />
          <button
            onClick={onClose}
            aria-label="Menü schließen"
            className="rounded-[var(--radius-chip)] p-2 text-[color:var(--copy-muted)] hover:bg-[rgba(31,36,48,0.05)] hover:text-[var(--foreground)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="soft-divider" />

        {/* Nav links */}
        <ul className="space-y-1 px-5 py-4">
          {siteNav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "block rounded-[var(--radius-chip)] px-4 py-3 text-base text-[color:var(--copy-muted)] transition-colors duration-200 hover:bg-[rgba(31,36,48,0.05)] hover:text-[var(--foreground)]",
                    active &&
                      "bg-[rgba(246,107,76,0.08)] text-[var(--foreground)]",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="soft-divider" />

        {/* Registrieren */}
        <div className="px-5 py-4">
          <Link
            href="/login"
            onClick={onClose}
            className="block rounded-[var(--radius-chip)] px-4 py-3 text-base text-[color:var(--copy-muted)] transition-colors duration-200 hover:bg-[rgba(31,36,48,0.05)] hover:text-[var(--foreground)]"
          >
            Registrieren
          </Link>
        </div>
      </nav>
    </>
  );
}
