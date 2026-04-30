import { ButtonLink } from "@/components/ui/button";
import { BoldZynapseCore } from "@/components/ui/bold-zynapse-core";

export function FinalCta() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <div className="grid gap-8 border-t border-[rgba(56,67,84,0.14)] pt-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)]">
        <article
          className="overflow-hidden rounded-[0.55rem] bg-[var(--copy-strong)] p-7 text-white shadow-[0_24px_54px_rgba(31,36,48,0.12)] sm:p-9"
          data-animate-item
        >
          <p className="font-mono text-xs tracking-[0.18em] text-white/58 uppercase">
            Für Brands
          </p>
          <h2
            className="mt-5 max-w-3xl overflow-visible pb-[0.08em] pr-[0.08em] font-display text-4xl leading-[0.96] font-semibold tracking-[-0.05em] text-balance sm:text-[3.4rem]"
            data-animate-heading
          >
            Der <span data-animate-word>nächste</span> Schritt passt zu{" "}
            <span data-animate-word>eurer</span>{" "}
            <span data-animate-word>Rolle</span>.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/74">
            <BoldZynapseCore>
              Wenn ihr bereits ein Kampagnenziel, Produkt oder Material habt,
              könnt ihr direkt einen Pilot oder Sprint anfragen. Wenn ihr erst
              verstehen wollt, wie Zynapse Core mit Briefing, Review und
              Delivery arbeitet, führt der zweite Weg zur Brand-Seite.
            </BoldZynapseCore>
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href="/request"
              size="lg"
              className="w-full justify-center border-white bg-white text-[var(--copy-strong)] hover:border-[rgba(246,107,76,0.9)] hover:text-white focus-visible:border-[rgba(246,107,76,0.9)] focus-visible:text-white sm:w-auto"
              primaryFillClassName="bg-[var(--accent)]"
            >
              Kampagne anfragen
            </ButtonLink>
            <ButtonLink
              href="/brands"
              variant="ghost"
              size="lg"
              className="w-full justify-center !rounded-[var(--radius-card)] !border !border-white/30 !bg-transparent !text-white !shadow-none hover:!border-white hover:!bg-white hover:!text-[var(--copy-strong)] focus-visible:!border-white focus-visible:!bg-white focus-visible:!text-[var(--copy-strong)] sm:w-auto"
            >
              Für Brands ansehen
            </ButtonLink>
          </div>
        </article>

        <article
          className="flex flex-col rounded-[0.55rem] border border-[rgba(56,67,84,0.16)] bg-white p-6 shadow-[0_14px_28px_rgba(31,36,48,0.06)] sm:p-7"
          data-animate-item
        >
          <p className="font-mono text-xs tracking-[0.18em] text-[var(--copy-soft)] uppercase">
            Für Kreative
          </p>
          <h3 className="mt-5 font-display text-[2.3rem] leading-[0.94] font-semibold tracking-[-0.055em] text-balance text-[var(--copy-strong)]">
            Bewerbung mit Portfolio und Fokusbereich.
          </h3>
          <p className="mt-5 text-base leading-7 text-[color:var(--copy-body)]">
            Für AI Creatives, die in klaren Kampagnen statt losen Einzelanfragen
            arbeiten wollen. Die Bewerbung fragt Portfolio, Fokusbereich und
            Arbeitsweise ab, damit wir passende Rollen und Kampagnen besser
            zuordnen können.
          </p>
          <div className="mt-auto pt-8">
            <ButtonLink href="/creatives" variant="secondary" size="lg" className="w-full justify-center">
              Für Kreative ansehen
            </ButtonLink>
          </div>
        </article>
      </div>

      <p className="mt-6 text-sm leading-6 text-[color:var(--copy-soft)]">
        <BoldZynapseCore>
          Erstgespräche sind kurz, konkret und unverbindlich. Wir klären vor
          allem Ziel, vorhandenes Material, Timing und ob ein Pilot oder ein
          laufender Zynapse-Core-Rahmen sinnvoller ist.
        </BoldZynapseCore>
      </p>
    </section>
  );
}
