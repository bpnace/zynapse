import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { LoginWaitlistForm } from "@/components/forms/waitlist/login-waitlist-form";
import { WorkspaceLoginForm } from "@/components/workspace/login/workspace-login-form";
import { getDemoWorkspaceConfig } from "@/lib/workspace/demo";
import { resolveWorkspaceNextPath } from "@/lib/workspace/routes";

export const metadata = buildMetadata({
  title: "Anmelden | Zynapse",
  description: "Zugang zum geschützten Zynapse-Bereich für eingeladene Teams mit Wartelisten-Fallback.",
  path: "/login",
  indexable: false,
});

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const demoConfig = getDemoWorkspaceConfig();
  const next =
    typeof params.next === "string" && params.next.length > 0
      ? resolveWorkspaceNextPath(params.next, "/app")
      : "/app";

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pt-15 pb-16 sm:px-8">
      <div className="max-w-5xl space-y-4">
        <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)]">
          Zugang zum geschützten Bereich von Zynapse.
        </h1>
        <p className="text-base text-[color:var(--copy-body)] sm:text-[1.0625rem]">
          Der Bereich ist derzeit nur auf Einladung zugänglich. Eingeladene
          Teams erhalten einen Code per E-Mail und gelangen damit direkt in
          ihren geschützten Arbeitsbereich. Wenn dein Zugang noch nicht
          freigeschaltet ist, kannst du dich auf die Warteliste setzen lassen.
        </p>
        {demoConfig.isEnabled ? (
          <p className="text-sm text-[var(--copy-muted)]">
            Für die geschlossene Produktdemo gibt es einen separaten Zugang unter{" "}
            <Link className="font-medium underline" href={demoConfig.loginRoute}>
              {demoConfig.loginRoute}
            </Link>
            .
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <WorkspaceLoginForm next={next} availableMethods={["otp"]} />
        <div className="rounded-[1.7rem] border border-[color:var(--line)] bg-[rgba(247,244,238,0.72)] p-6">
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
            Noch kein Zugang? Trag dich auf die Warteliste ein.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--copy-body)]">
            Solange der Zugang nur ausgewählten Teams offensteht, ist die
            Warteliste der richtige Weg für neue Anfragen ohne direkten
            Einladungslink.
          </p>
          <div className="mt-5">
            <LoginWaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}
