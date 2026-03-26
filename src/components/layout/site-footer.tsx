import Image from "next/image";
import { footerGroups } from "@/lib/content/site";
import Link from "next/link";
import { Wordmark } from "@/components/layout/wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#1d1d1d] text-[color:var(--surface-paper)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.45fr)_repeat(3,minmax(0,0.18fr))] lg:px-10">
        <div className="space-y-4">
          <div className="grid w-fit grid-cols-[auto_1fr] items-center gap-4">
            <Image
              src="/logo/LogoSimple.png"
              alt="Zynapse Signet"
              width={2000}
              height={2000}
              className="h-15 w-auto shrink-0 sm:h-15"
            />
            <Wordmark
              src="/logo/Wortmarke2.png"
              width={1208}
              height={305}
              imageClassName="w-[10.5rem] sm:w-[12.5rem]"
            />
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
            Von der einfachen Idee zum kuratierten Kampagnen-Setup, das sofort einsatzbereit ist.
          </h2>
          <p className="max-w-md text-[color:var(--surface-paper)]">
            Zynapse verbindet Brands mit passenden AI-Spezialist:innen und
            übersetzt Briefings in klare Setups, Varianten und Handover.
          </p>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="font-mono text-xs tracking-[0.18em] uppercase text-[color:var(--surface-paper)]">
              {group.title}
            </h3>
            <ul className="space-y-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[color:var(--surface-paper)] transition-opacity duration-200 hover:opacity-80"
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
