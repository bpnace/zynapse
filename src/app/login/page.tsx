import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { LoginWaitlistForm } from "@/components/forms/waitlist/login-waitlist-form";
import { WorkspaceLoginForm } from "@/components/workspace/login/workspace-login-form";
import { getDemoWorkspaceConfig } from "@/lib/workspace/demo";

export const metadata = buildMetadata({
  title: "Anmelden | Zynapse",
  description: "Invite-only Login für den Brand Workspace von Zynapse mit Fallback zur Waitlist.",
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
      ? params.next
      : "/workspace";

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pt-15 pb-16 sm:px-8">
      <div className="max-w-5xl space-y-4">
        <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)]">
          Zugang zum Workspace von Zynapse.
        </h1>
        <p className="text-base text-[color:var(--copy-body)] sm:text-[1.0625rem]">
          Der Workspace ist aktuell invite-only. Eingeladene Benutzer erhalten
          einen Login-Code per E-Mail für ihren persönlichen, geschützten Bereich. Wenn du
          noch keinen Zugang hast, kannst du dich  weiter für frühen
          Zugang vormerken.
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
            Kein Invite? Trag dich für den frühen Zugang ein.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--copy-body)]">
            Bis der invite-only Zugriff breiter freigeschaltet wird, bleibt die
            Waitlist der richtige Weg für neue Teams ohne direkten Zugangslink.
          </p>
          <div className="mt-5">
            <LoginWaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}
