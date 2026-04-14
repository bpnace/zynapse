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
    "Geschlossener Demo-Zugang für den kuratierten Brand-Workspace von Zynapse.",
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
  if (errorCode === "demo_account_required") {
    return "Diese Demo-Anmeldung ist nur für das konfigurierte Demo-Konto freigeschaltet.";
  }

  if (errorCode === "invalid_credentials") {
    return "Die Demo-Zugangsdaten sind ungültig.";
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
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pt-15 pb-16 sm:px-8">
      <div className="max-w-3xl space-y-4">
        <p className="workspace-section-label">Geschlossene Demo</p>
        <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)]">
          Demo-Login für den Zynapse Workspace.
        </h1>
        <p className="text-base text-[color:var(--copy-body)] sm:text-[1.0625rem]">
          Dieser Zugang ist für eine kuratierte, schreibgeschützte Produktdemo
          vorgesehen. Inhalte werden für Demos zurückgesetzt und dienen nur zur
          Ansicht des aktuellen Produktstands.
        </p>
      </div>

      <form
        action={submitDemoLogin}
        className="space-y-4 rounded-[1.7rem] border border-[color:var(--line)] bg-white/75 p-6 text-left"
      >
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
            Geschlossener Demo-Zugang
          </h2>
          <p className="text-sm leading-6 text-[color:var(--copy-body)]">
            Das Demo-Konto landet direkt im schreibgeschützten Showcase-Workspace.
          </p>
        </div>

        <input type="hidden" name="next" value={next} />

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
            defaultValue={demoConfig.canonicalEmail}
            className="field-input"
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

        <button type="submit" className="workspace-button workspace-button-primary">
          Mit Passwort anmelden
        </button>
      </form>
    </section>
  );
}
