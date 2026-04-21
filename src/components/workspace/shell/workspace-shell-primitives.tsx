"use client";

import Link from "next/link";
import { LogOut, Settings2 } from "lucide-react";
import { Wordmark } from "@/components/layout/wordmark";
import { cn } from "@/lib/utils";

function getInitials(value: string) {
  const parts = value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "ZY";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function WorkspaceLogoLockup({
  label,
  demoBadge,
}: {
  label: string;
  demoBadge?: string | null;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Wordmark className="shrink-0" imageClassName="w-[7.4rem]" />
      <span className="workspace-eyebrow">{label}</span>
      {demoBadge ? <span className="workspace-demo-badge">{demoBadge}</span> : null}
    </div>
  );
}

export function WorkspaceAvatarSlot({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      aria-label={`${name} avatar`}
      className={cn("workspace-avatar-slot", className)}
      title={name}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
}

export function WorkspaceIdentityActions({
  settingsHref,
  settingsLabel = "Settings",
  logoutLabel = "Logout",
  compact = false,
}: {
  settingsHref: string;
  settingsLabel?: string;
  logoutLabel?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("workspace-identity-actions", compact && "workspace-identity-actions-compact")}>
      <Link href={settingsHref} className="workspace-shell-action">
        <Settings2 className="h-4 w-4" />
        <span>{settingsLabel}</span>
      </Link>
      <form action="/api/auth/logout" method="post">
        <button type="submit" className="workspace-shell-action workspace-shell-action-secondary">
          <LogOut className="h-4 w-4" />
          <span>{logoutLabel}</span>
        </button>
      </form>
    </div>
  );
}
