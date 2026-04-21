const workspaceLabelMap: Record<string, string> = {
  approved: "Freigegeben",
  approval_note: "Freigabehinweis",
  brief_received: "Briefing eingegangen",
  brand_admin: "Brand-Admin",
  brand_owner: "Brand Owner",
  brand_marketing_lead: "Marketing Lead",
  brand_reviewer: "Brand-Review",
  brand_legal_reviewer: "Legal Review",
  brand_media_buyer: "Media Buying",
  change_request: "Änderungswunsch",
  changes_requested: "Änderungen angefordert",
  comment: "Kommentar",
  completed: "Abgeschlossen",
  draft: "Entwurf",
  failed: "Fehlgeschlagen",
  handover_ready: "Bereit zur Übergabe",
  in_progress: "In Arbeit",
  in_review: "In Prüfung",
  log: "Log-Fallback",
  pending: "Offen",
  production_ready: "Produktion bereit",
  growth: "Wachstum",
  setup_planned: "Setup geplant",
  starter: "Starter",
  submitted: "Eingereicht",
  webhook: "Webhook",
  zynapse_ops: "Admin",
  ops: "Admin",
  ops_admin: "Admin",
};

const workspaceAssetTypeMap: Record<string, string> = {
  short_video: "Kurzvideo",
  static: "Statisches Motiv",
};

export function formatWorkspaceLabel(value: string) {
  const normalized = value.toLowerCase();
  return workspaceLabelMap[normalized] ?? value.replaceAll("_", " ");
}

export function formatWorkspaceAssetType(value: string) {
  const normalized = value.toLowerCase();
  return workspaceAssetTypeMap[normalized] ?? formatWorkspaceLabel(value);
}

export function formatWorkspaceRole(value: string) {
  return formatWorkspaceLabel(value);
}

export function formatWorkspaceDate(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export function formatWorkspaceTime(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export function formatWorkspaceDateTime(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}
