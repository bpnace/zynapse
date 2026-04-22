import { BrandInquiryWizard } from "@/components/forms/brand-inquiry/brand-inquiry-wizard";
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
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-15 pb-16 sm:px-8 lg:px-10">
      <div className="space-y-5">
        <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] sm:text-6xl">
          Starte dein Kreativbriefing in wenigen Minuten.
        </h1>
        <p className="max-w-4xl text-lg leading-8 text-[color:var(--copy-muted)]">
          Du brauchst kein perfektes Briefing. Produkt, Ziel, Zielgruppe und
          Kanäle reichen, damit Zynapse Core einen ersten Kreativplan
          vorschlagen kann.
        </p>
      </div>
      <BrandInquiryWizard />
    </section>
  );
}
