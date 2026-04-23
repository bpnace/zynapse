import { buildMetadata } from "@/lib/seo";
import { LoginWaitlistForm } from "@/components/forms/waitlist/login-waitlist-form";

export const metadata = buildMetadata({
  title: "Anmelden | Zynapse",
  description: "Invite-only Login für den Brand Workspace von Zynapse mit Fallback zur Waitlist.",
  path: "/login",
  indexable: false,
});

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pt-15 pb-16 sm:px-8">
      <div className="max-w-4xl space-y-4">
        <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)]">
          Wir legen bald los!
        </h1>
        <p className="text-base text-[color:var(--copy-body)] sm:text-[1.0625rem]">
          Der Workspace wird aktuell schrittweise entwickelt und freigeschaltet. Trage dich mit
          deiner geschäftlichen E-Mail ein, damit wir dich nach dem Launch oder
          beim nächsten passenden Rollout direkt berücksichtigen können.
        </p>
      </div>

      <div className="rounded-[1.7rem] border border-[color:var(--line)] bg-white/75 p-6 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--copy-muted)]">
          Frühzugang
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--copy-strong)] sm:text-4xl">
          Trag dich für den bevorzugten Zugang ein.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--copy-body)] sm:text-base">
          Solange der Workspace noch nicht allgemein freigeschaltet ist, bleibt
          die Waitlist der richtige Weg für neue Teams. Wir melden uns direkt,
          sobald wir den nächsten Zugang oder einen passenden Startpunkt
          freigeben.
        </p>
        <div className="mt-6 max-w-3xl">
          <LoginWaitlistForm />
        </div>
      </div>
    </section>
  );
}
