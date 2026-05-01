import { BrandInquiryWizard } from "@/components/forms/brand-inquiry/brand-inquiry-wizard";
import { BoldZynapseCore } from "@/components/ui/bold-zynapse-core";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Kreativbriefing starten | Zynapse",
  description:
    "Starte dein Kreativbriefing in wenigen Minuten. Produkt, Ziel, Zielgruppe und Kanäle reichen, damit Zynapse Core einen ersten Kreativplan vorschlagen kann.",
  path: "/request",
  indexable: false,
});

export default function RequestPage() {
  return (
    <section className="mx-auto flex w-full max-w-[96rem] flex-col gap-8 px-6 pt-15 pb-16 sm:px-8 lg:px-10">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:items-end">
        <h1 className="max-w-6xl font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)] sm:text-6xl lg:text-7xl">
          Starte dein Kreativbriefing in wenigen Minuten.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-[color:var(--copy-muted)] lg:justify-self-end lg:pb-2">
          <BoldZynapseCore>
            Du brauchst kein perfektes Briefing. Produkt, Ziel, Zielgruppe und
            Kanäle reichen, damit Zynapse Core einen ersten Kreativplan
            vorschlagen kann.
          </BoldZynapseCore>
        </p>
      </div>
      <BrandInquiryWizard />
    </section>
  );
}
