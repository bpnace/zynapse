import { BrandInquiryWizard } from "@/components/forms/brand-inquiry/brand-inquiry-wizard";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Brand Inquiry | Zynapse",
  description:
    "Geführter Kampagnen-Intake für Brands mit klaren Schritten von Branche bis Review.",
  path: "/request",
});

export default function RequestPage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pt-32 pb-16 sm:px-8 lg:px-10">
      <div className="space-y-5">
        <span className="eyebrow">Brand Onramp</span>
        <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] sm:text-6xl">
          Kampagne anfragen, ohne erst den gesamten Produktionsprozess zu verstehen.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-[color:var(--copy-muted)]">
          Der Wizard reduziert den Einstieg auf die nötigen Entscheidungen. Danach
          kann der Manager- und Studio-Flow sauber übernehmen.
        </p>
      </div>
      <BrandInquiryWizard />
    </section>
  );
}
