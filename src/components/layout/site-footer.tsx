import { footerGroups } from "@/lib/content/site";
import Link from "next/link";
import { Wordmark } from "@/components/layout/wordmark";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,248,240,0.78),rgba(255,255,255,0.92))]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.45fr)_repeat(3,minmax(0,0.18fr))] lg:px-10">
        <div className="space-y-4">
          <Wordmark className="inline-flex items-center" />
          <h2 className="font-display text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
            Von der einfachen Idee zum kuratierten Kampagnen-Setup, das sofort einsatzbereit ist.
          </h2>
          <p className="max-w-md text-[color:var(--copy-muted)]">
            Zynapse verbindet Brands mit passenden AI-Spezialist:innen und
            übersetzt Briefings in klare Setups, Varianten und Handover.
          </p>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--accent-soft)]">
              {group.title}
            </h3>
            <ul className="space-y-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[color:var(--copy-muted)] hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
