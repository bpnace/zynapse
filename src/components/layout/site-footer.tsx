import Image from "next/image";
import { CookieSettingsTrigger } from "@/components/layout/cookie-settings-trigger";
import { footerGroups } from "@/lib/content/site";
import { SiteNavLink } from "@/components/layout/site-nav-link";
import { Wordmark } from "@/components/layout/wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#1d1d1d] text-[color:var(--surface-paper)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pt-14 pb-10 sm:px-8 lg:grid-cols-[minmax(0,0.45fr)_repeat(3,minmax(0,0.18fr))] lg:px-10">
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
            Von der Idee bis zu Varianten, die euer Media Team direkt nutzen kann.
          </h2>
          <p className="max-w-md text-[color:var(--surface-paper)]">
            Zynapse Core erkennt, was zu Marke, Ziel und Zielgruppe
            passt, entwickelt daraus klare Richtungen und bringt geprüfte
            Varianten strukturiert in Review und Übergabe.
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
                  <SiteNavLink
                    href={link.href}
                    className="text-sm text-[color:var(--surface-paper)] transition-opacity duration-200 hover:opacity-80"
                  >
                    {link.label}
                  </SiteNavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 pb-6 sm:px-8 lg:px-10">
        <CookieSettingsTrigger className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/55 transition-colors duration-200 hover:text-white/82">
          Cookie-Einstellungen
        </CookieSettingsTrigger>
        <a
          href="https://stackwerkhaus.de"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/55 transition-colors duration-200 hover:text-[rgba(249,197,106,0.92)]"
          aria-label="Design by Stackwerkhaus"
        >
          Design by Stackwerkhaus
        </a>
      </div>
    </footer>
  );
}
