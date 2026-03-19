import { BrandInquiryWizard } from "@/components/forms/brand-inquiry/brand-inquiry-wizard";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Brand-Anfrage | Zynapse",
  description:
    "Geführte Brand-Anfrage mit klaren Schritten von Ausgangslage bis Übergabe.",
  path: "/request",
});

export default function RequestPage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-15 pb-16 sm:px-8 lg:px-10">
      <div className="space-y-5">
        <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] sm:text-6xl">
          Eine Brand-Anfrage, die das Wesentliche sauber einsammelt.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-[color:var(--copy-muted)]">
          Der Anfrage-Flow reduziert den Einstieg auf die Entscheidungen, die für ein
          erstes Kampagnen-Setup wirklich zählen. Danach kann der weitere Prozess
          sauber in Planung und Produktion übergehen.
        </p>
      </div>
      <BrandInquiryWizard />
    </section>
  );
}
