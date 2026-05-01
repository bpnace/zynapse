import { JsonLdScript } from "@/components/seo/json-ld";
import { PageMotion } from "@/components/animation/page-motion";
import { BoldZynapseCore } from "@/components/ui/bold-zynapse-core";
import { ButtonLink } from "@/components/ui/button";
import { MarketingFaq } from "@/components/marketing/marketing-faq";
import { VideoPreviewCard } from "@/components/marketing/video-preview-card";
import { videoVariants } from "@/lib/mock-data/studio";
import {
  buildMarketingFaqJsonLd,
  buildMarketingMetadata,
  buildMarketingPageJsonLd,
  getMarketingRouteFaqItems,
} from "@/lib/seo";

export const metadata = buildMarketingMetadata("/cases");

const coreExplainers = [
  {
    step: "01",
    title: "Material einordnen",
    copy: "Zynapse Core liest nicht nur den Look eines Clips, sondern seine Aufgabe: Markenwelt, Proof, Produktdetail, Aufmerksamkeit oder Vertrauen.",
  },
  {
    step: "02",
    title: "Szenario bauen",
    copy: "Aus dem Ausgangsmaterial entsteht ein testbares Szenario mit Hook, Funnel-Aufgabe, Formatlogik und Testfrage für das Media-Team.",
  },
  {
    step: "03",
    title: "Übergabe vorbereiten",
    copy: "Am Ende steht kein einzelnes schönes Video, sondern ein Creative Pack mit Varianten, Review-Kontext und einer sauberen Logik für die Ausspielung.",
  },
] as const;

export default function CasesPage() {
  const casesJsonLd = buildMarketingPageJsonLd("/cases");
  const casesFaqJsonLd = buildMarketingFaqJsonLd("/cases");
  const casesFaqItems = getMarketingRouteFaqItems("/cases");

  return (
    <>
      <JsonLdScript data={casesJsonLd} />
      {casesFaqJsonLd ? <JsonLdScript data={casesFaqJsonLd} /> : null}
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
              <VideoPreviewCard
                key={variant.id}
                variant={variant}
                mode="case"
              />
            ))}
          </div>
        </section>

        <section
          className="mx-auto w-full max-w-7xl px-6 pb-16 sm:px-8 lg:px-10"
          data-reveal-section
          data-stagger="dense"
        >
          <div className="border-t border-[rgba(56,67,84,0.14)] pt-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] lg:items-end">
              <div className="space-y-5">
                <p className="eyebrow" data-animate-heading>
                  Unter dem Video
                </p>
                <h2
                  className="max-w-3xl font-display text-3xl leading-[0.95] font-semibold tracking-[-0.05em] text-balance text-[var(--copy-strong)] sm:text-[3.2rem]"
                  data-animate-heading
                >
                  Was Zynapse Core aus einem Clip macht.
                </h2>
                <p
                  className="max-w-2xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
                  data-animate-copy
                >
                  <BoldZynapseCore>
                    Die Videos sind keine fertigen Kundenreferenzen. Sie zeigen,
                    wie Zynapse Core ein visuelles Signal in Kampagnenlogik
                    übersetzt: Aufgabe, Varianten, Review und Übergabe.
                  </BoldZynapseCore>
                </p>
              </div>

              <aside
                className="rounded-[0.55rem] bg-[var(--copy-strong)] p-6 text-white sm:p-7"
                data-animate-item
              >
                <p className="font-mono text-[10px] tracking-[0.16em] text-white/58 uppercase">
                  Warum das zählt
                </p>
                <p className="mt-4 text-[1rem] leading-7 text-white/76">
                  <BoldZynapseCore>
                    Ohne Zynapse Core bleibt ein gutes Video oft nur ein
                    schönes Asset. Im Sprint wird daraus ein System aus
                    Einstiegen, Hypothesen, Review-Pfad und Media-Übergabe.
                  </BoldZynapseCore>
                </p>
              </aside>
            </div>

            <div className="mt-8 grid overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white shadow-[0_18px_42px_rgba(31,36,48,0.07)] lg:grid-cols-3">
              {coreExplainers.map((item, index) => (
                <article
                  key={item.title}
                  className={`flex min-h-[14rem] flex-col p-5 sm:p-6 ${
                    index > 0 ? "border-t border-[rgba(56,67,84,0.14)] lg:border-t-0 lg:border-l" : ""
                  } border-[rgba(56,67,84,0.14)] bg-white`}
                  data-animate-item
                >
                  <p className="font-display text-[3rem] leading-none font-semibold tracking-[-0.05em] text-[var(--accent-strong)]">
                    {item.step}
                  </p>
                  <h3 className="mt-6 font-display text-[1.45rem] leading-[1.02] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-[color:var(--copy-body)]">
                    <BoldZynapseCore>{item.copy}</BoldZynapseCore>
                  </p>
                </article>
              ))}
            </div>

            <MarketingFaq
              className="mt-8"
              items={casesFaqItems}
              eyebrow="FAQ"
              title="Was der Sprint vor der Übergabe klärt."
              copy="Diese Fragen sind kein loses FAQ ohne Antwort. Sie zeigen, welche Entscheidungen Zynapse Core aus Briefing, Material und Review-Kontext vorbereitet."
            />
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
