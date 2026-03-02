import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Impressum | Zynapse",
  description: "Rechtliche Anbieterkennzeichnung für Zynapse.",
  path: "/legal/imprint",
});

export default function ImprintPage() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pt-32 pb-16 sm:px-8">
      <span className="eyebrow">Impressum</span>
      <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em]">
        Rechtliche Anbieterkennzeichnung
      </h1>
      <div className="section-card rounded-[2rem] p-8 text-[color:var(--copy-muted)]">
        <p>
          Diese Seite ist als strukturierte Platzhalterseite umgesetzt. Vor dem
          Produktivlaunch müssen Name, Anschrift, vertretungsberechtigte Person,
          Kontaktkanäle und gegebenenfalls Handelsregisterdaten rechtlich geprüft
          und final ergänzt werden.
        </p>
      </div>
    </section>
  );
}
