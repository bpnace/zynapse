import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Anmelden | Zynapse",
  description: "Platzhalter für den späteren Zugang zu internen Nutzer- und Manager-Workflows.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 pt-32 pb-16 sm:px-8">
      <span className="eyebrow">Anmelden</span>
      <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em]">
        Der Login wird erst mit der operativen Plattform freigeschaltet.
      </h1>
      <div className="section-card rounded-[2rem] p-8 text-[color:var(--copy-muted)]">
        Dashboards und operative Accounts sind bewusst noch nicht Teil der
        öffentlichen v1. Diese Route bleibt als Platzhalter bestehen, damit die
        spätere Erweiterung sauber vorbereitet ist.
      </div>
    </section>
  );
}
