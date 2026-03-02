import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Anmelden | Zynapse",
  description: "Zukünftiger Einstieg für interne Nutzer und Manager-Workflows.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 pt-32 pb-16 sm:px-8">
      <span className="eyebrow">Anmelden</span>
      <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em]">
        Noch kein v1-Produktzugang
      </h1>
      <div className="section-card rounded-[2rem] p-8 text-[color:var(--copy-muted)]">
        Dashboards und operative Accounts sind ausdrücklich nicht Teil des v1-MVP.
        Diese Route bleibt als Platzhalter erhalten, damit Navigation und spätere
        Expansion konsistent vorbereitet sind.
      </div>
    </section>
  );
}
