import { buildMetadata } from "@/lib/seo";
import { LoginWaitlistForm } from "@/components/forms/waitlist/login-waitlist-form";

export const metadata = buildMetadata({
  title: "Anmelden | Zynapse",
  description: "Trag dich für frühen Zugang zur operativen Plattform von Zynapse ein.",
  path: "/login",
  indexable: false,
});

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 pt-32 pb-16 text-center sm:px-8">
      <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)]">
        Sichere dir frühen Zugang zu Zynapse.
      </h1>
      <p className="px-0 text-base text-[color:var(--copy-body)] sm:px-8 sm:text-[1.0625rem]">
        Hinter dem Login entsteht der operative Bereich von Zynapse: mit
        zentralen Dashboards, laufenden Workspaces, klaren Projektzugängen und
        allen Funktionen, die Zusammenarbeit zwischen Brand und Creative
        strukturierter machen. Trag dich jetzt ein und wir informieren dich
        direkt, sobald die ersten Zugänge freigeschaltet werden.
      </p>
      <div className="mx-auto w-full max-w-xl">
        <LoginWaitlistForm />
      </div>
    </section>
  );
}
