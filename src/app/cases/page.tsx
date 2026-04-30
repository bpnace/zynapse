import { JsonLdScript } from "@/components/seo/json-ld";
import { PageMotion } from "@/components/animation/page-motion";
import { BoldZynapseCore } from "@/components/ui/bold-zynapse-core";
import { ButtonLink } from "@/components/ui/button";
import { videoVariants } from "@/lib/mock-data/studio";
import { buildBreadcrumbs, buildMetadata, buildPageJsonLd } from "@/lib/seo";

const pageSeo = {
  title: "Cases und Szenarien für Video Ads | Zynapse",
  description:
    "Sechs kompakte Szenarien zeigen, wie Zynapse Core aus vorhandenem Material, Kampagnenziel und Review-Logik testbare Video-Ads entwickelt.",
  path: "/cases",
} as const;

export const metadata = buildMetadata(pageSeo);

const coreExplainers = [
  {
    step: "01",
    title: "Material einordnen",
    copy: "Zynapse Core liest nicht nur den Look eines Clips, sondern seine Aufgabe: Markenwelt, Proof, Produktdetail, Aufmerksamkeit oder Vertrauen.",
  },
  {
    step: "02",
    title: "Szenario bauen",
    copy: "Aus dem Ausgangsmaterial entsteht ein testbares Szenario mit Hook, Funnel-Aufgabe, Formatlogik und klarer Frage für das Media-Team.",
  },
  {
    step: "03",
    title: "Übergabe vorbereiten",
    copy: "Am Ende steht kein einzelnes schönes Video, sondern ein Creative Pack mit Varianten, Review-Kontext und einer sauberen Logik für die Ausspielung.",
  },
] as const;

const sprintSignals = [
  "Welche Botschaft trägt der erste Frame?",
  "Welche Zielgruppe soll das Szenario erkennen?",
  "Welche Variante braucht ein anderes Format oder einen anderen Hook?",
  "Welche Entscheidung muss vor der Übergabe noch im Review fallen?",
] as const;

function formatDuration(s: string): string {
  const seconds = parseInt(s, 10);
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function CasesPage() {
  const casesJsonLd = buildPageJsonLd({
    ...pageSeo,
    pageType: "CollectionPage",
    breadcrumbs: buildBreadcrumbs("Cases", pageSeo.path),
  });

  return (
    <>
      <JsonLdScript data={casesJsonLd} />
      <PageMotion>
        <section
          className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-15 pb-14 sm:px-8 lg:px-10"
          data-reveal-section
        >
          <div className="max-w-5xl space-y-5">
            <p className="eyebrow" data-animate-heading>
              Cases
            </p>
            <h1
              className="font-display text-[clamp(3rem,7vw,5.2rem)] leading-[0.9] font-semibold tracking-[-0.06em] text-balance text-[var(--copy-strong)]"
              data-animate-heading
            >
              Szenarien für <span className="title-accent">testbare Video Ads</span>.
            </h1>
            <p
              className="max-w-4xl text-base leading-7 text-[color:var(--copy-body)] sm:text-lg sm:leading-8"
              data-animate-copy
            >
              <BoldZynapseCore>
                Diese Szenarien zeigen bewusst Ausgangsmaterial, Funnel-Aufgabe
                und den Weg, auf dem Zynapse Core daraus ein prüfbares Creative
                Pack für Paid Social macht.
              </BoldZynapseCore>
            </p>
          </div>
        </section>

        <section
          className="mx-auto w-full max-w-7xl px-6 pb-14 sm:px-8 lg:px-10"
          data-reveal-section
          data-stagger="dense"
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {videoVariants.map((variant) => (
              <article
                key={variant.id}
                className="overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white shadow-[0_14px_28px_rgba(31,36,48,0.06)]"
                data-animate-item
              >
                <div className="relative h-[13rem] overflow-hidden bg-[var(--copy-strong)]">
                  <video
                    src={variant.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,36,48,0.08),rgba(31,36,48,0.42))]" />
                  <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between gap-3">
                    <span className="bg-white px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-[var(--copy-strong)] uppercase">
                      {variant.format}
                    </span>
                    <span className="bg-[var(--copy-strong)] px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-white/90 uppercase">
                      {formatDuration(variant.length)}
                    </span>
                  </div>
                </div>
                <div className="grid gap-4 p-5">
                  <div className="flex items-center justify-between gap-4 border-b border-[rgba(56,67,84,0.12)] pb-3">
                    <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--copy-soft)] uppercase">
                      {variant.angle}
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--copy-soft)] uppercase">
                      {variant.objective}
                    </p>
                  </div>
                  <h2 className="font-display text-[1.65rem] leading-[0.98] font-semibold tracking-[-0.045em] text-balance text-[var(--copy-strong)]">
                    {variant.hookTitle}
                  </h2>
                  <p className="text-sm leading-6 text-[color:var(--copy-body)]">
                    {variant.scenarioCopy}
                  </p>
                  <p className="border-t border-[rgba(56,67,84,0.12)] pt-3 font-mono text-[10px] tracking-[0.14em] text-[var(--copy-soft)] uppercase">
                    {variant.deliveryLabel} / {variant.format}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="mx-auto w-full max-w-7xl px-6 pb-16 sm:px-8 lg:px-10"
          data-reveal-section
          data-stagger="dense"
        >
          <div className="grid gap-8 border-t border-[rgba(56,67,84,0.14)] pt-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
            <div className="space-y-5">
              <p className="eyebrow" data-animate-heading>
                Unter dem Video
              </p>
              <h2
                className="font-display text-3xl leading-[0.95] font-semibold tracking-[-0.05em] text-balance text-[var(--copy-strong)] sm:text-[3.2rem]"
                data-animate-heading
              >
                Was Zynapse Core aus einem Clip macht.
              </h2>
              <p
                className="text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
                data-animate-copy
              >
                <BoldZynapseCore>
                  Die Videos sind nicht als fertige Kundenreferenzen mit
                  Messwerten gemeint. Sie zeigen, wie Zynapse Core ein
                  visuelles Signal in Kampagnenlogik übersetzt: Welche Aufgabe
                  erfüllt der Clip, welche Varianten brauchen wir daraus und
                  welche Entscheidung muss im Review fallen?
                </BoldZynapseCore>
              </p>
            </div>

            <div className="overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.16)] bg-white shadow-[0_18px_42px_rgba(31,36,48,0.07)]">
              {coreExplainers.map((item, index) => (
                <article
                  key={item.title}
                  className={`grid gap-4 px-5 py-5 sm:grid-cols-[4rem_minmax(0,1fr)] sm:px-6 ${
                    index > 0 ? "border-t border-[rgba(56,67,84,0.12)]" : ""
                  }`}
                  data-animate-item
                >
                  <p className="font-display text-[2.3rem] leading-none font-semibold tracking-[-0.055em] text-[var(--accent-strong)]">
                    {item.step}
                  </p>
                  <div className="space-y-2">
                    <h3 className="font-display text-[1.35rem] leading-[1] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-6 text-[color:var(--copy-body)]">
                      <BoldZynapseCore>{item.copy}</BoldZynapseCore>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]">
            <div
              className="rounded-[0.55rem] bg-[var(--copy-strong)] p-6 text-white sm:p-7"
              data-animate-item
            >
              <p className="font-mono text-[10px] tracking-[0.16em] text-white/58 uppercase">
                Warum das wichtig ist
              </p>
              <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-white/76">
                <BoldZynapseCore>
                  Ohne Zynapse Core bleibt ein gutes Video oft nur ein schönes
                  Asset. Im Sprint wird daraus ein System: mehrere Einstiege,
                  klare Hypothesen, ein Review-Pfad und eine Übergabe, mit der
                  Paid Social wirklich weiterarbeiten kann.
                </BoldZynapseCore>
              </p>
            </div>

            <div
              className="rounded-[0.55rem] border border-[rgba(56,67,84,0.16)] bg-white p-6 sm:p-7"
              data-animate-item
            >
              <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--copy-soft)] uppercase">
                Was der Sprint klärt
              </p>
              <ul className="mt-4 grid gap-3">
                {sprintSignals.map((signal) => (
                  <li
                    key={signal}
                    className="border-t border-[rgba(56,67,84,0.12)] pt-3 text-sm leading-6 text-[color:var(--copy-body)]"
                  >
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-[rgba(56,67,84,0.12)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-3xl text-base leading-7 text-[color:var(--copy-body)]">
              <BoldZynapseCore>
                Wenn ihr eigenes Material, eine Kampagnenidee oder nur eine
                grobe Richtung habt, kann Zynapse Core daraus den ersten
                Szenario-Sprint vorbereiten.
              </BoldZynapseCore>
            </p>
            <ButtonLink
              href="/request"
              size="lg"
              className="w-full justify-center sm:w-auto"
            >
              Szenario-Sprint anfragen
            </ButtonLink>
          </div>
        </section>
      </PageMotion>
    </>
  );
}
