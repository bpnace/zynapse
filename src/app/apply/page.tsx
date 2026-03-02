import { ManagerApplicationForm } from "@/components/forms/manager-application/manager-application-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Manager Bewerbung | Zynapse",
  description:
    "Qualifizierungsflow für Social Media Manager mit Cases, Fokuskanälen und echter Performance-Erfahrung.",
  path: "/apply",
});

export default function ApplyPage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-32 pb-16 sm:px-8 lg:px-10">
      <div className="space-y-5">
        <span className="eyebrow">Manager-Einstieg</span>
        <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] sm:text-6xl">
          Bewirb dich für den Manager-Track, wenn du Kampagnen wirklich führen kannst.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-[color:var(--copy-muted)]">
          Uns interessieren Kampagnenlogik, Kanalverständnis und echte
          Growth-Erfahrung. Nicht generische Kontaktdaten ohne Substanz.
        </p>
      </div>
      <ManagerApplicationForm />
    </section>
  );
}
