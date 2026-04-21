import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { submitDemoLogin } from "@/app/demo-login/actions";
import {
  getDemoWorkspaceConfig,
  resolveDemoWorkspaceNextPath,
} from "@/lib/workspace/demo";

export const metadata = buildMetadata({
  title: "Geschlossene Demo | Zynapse",
  description:
    "Geschlossener Demo-Zugang für den kuratierten Markenbereich von Zynapse.",
  path: "/demo-login",
  indexable: false,
});

type DemoLoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readStringParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return typeof value === "string" ? value : "";
}

function getErrorMessage(errorCode: string) {
  if (errorCode === "invalid_credentials") {
    return "Die Demo-Zugangsdaten sind ungültig oder die Demo-Anmeldung ist für diese Adresse nicht freigeschaltet.";
  }

  if (errorCode === "auth_unavailable") {
    return "Die Demo-Anmeldung ist aktuell nicht verfügbar.";
  }

  return "";
}

export default async function DemoLoginPage({
  searchParams,
}: DemoLoginPageProps) {
  const demoConfig = getDemoWorkspaceConfig();

  if (!demoConfig.isEnabled) {
    redirect("/login");
  }

  const params = (await searchParams) ?? {};
  const next = resolveDemoWorkspaceNextPath(readStringParam(params, "next"));
  const errorMessage = getErrorMessage(readStringParam(params, "error"));

  return (
    <section className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-5xl items-center px-6 py-12 sm:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.85fr)]">
        <div className="workspace-panel flex flex-col justify-between px-7 py-7 sm:px-8 sm:py-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="workspace-demo-badge">Geschlossene Demo</span>
              <span className="workspace-section-label">Privater Zugang</span>
            </div>
            <div className="space-y-3">
              <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)]">
                Der private Kundenbereich für den aktuellen Zynapse-Stand.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.04rem]">
                Diese Demo zeigt den betreuten Review-, Übergabe- und
                Creative-Flow in einer schreibgeschützten Portalansicht.
              </p>
            </div>
          </div>

          <div className="workspace-minimal-divider mt-10 pt-5">
            <div className="workspace-stat-strip">
              <span className="workspace-stat-chip">Review</span>
              <span className="workspace-stat-chip">Übergabe</span>
              <span className="workspace-stat-chip">Read-only Demo</span>
            </div>
          </div>
        </div>

        <form
          action={submitDemoLogin}
          className="workspace-panel flex flex-col justify-between px-6 py-6 text-left sm:px-7 sm:py-7"
        >
          <div className="space-y-2">
            <p className="workspace-section-label">Anmelden</p>
            <h2 className="font-display text-[2rem] leading-[1.02] font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
              Geschlossener Demo-Zugang
            </h2>
            <p className="text-sm leading-6 text-[color:var(--copy-body)]">
              Je nach Demo-Account landest du direkt im Brand- oder Creative-Bereich.
            </p>
          </div>

          <input type="hidden" name="next" value={next} />

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="workspace-email"
                className="text-sm font-medium text-[var(--copy-strong)]"
              >
                Geschäftliche E-Mail
              </label>
              <input
                id="workspace-email"
                name="workspace-email"
                type="email"
                autoComplete="email"
                className="field-input"
                placeholder="team@brand.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="workspace-password"
                className="text-sm font-medium text-[var(--copy-strong)]"
              >
                Passwort
              </label>
              <input
                id="workspace-password"
                name="workspace-password"
                type="password"
                autoComplete="current-password"
                className="field-input"
                placeholder="Demo-Passwort"
                required
              />
            </div>

            {errorMessage ? (
              <p className="text-sm text-[var(--danger)]">{errorMessage}</p>
            ) : null}
          </div>

          <div className="workspace-minimal-divider mt-8 pt-5">
            <button type="submit" className="workspace-button workspace-button-primary w-full">
              Mit Passwort anmelden
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
