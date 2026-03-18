import type { CampaignAngle, VideoVariantPreview } from "@/types/site";

export const campaignAngles: CampaignAngle[] = [
  {
    title: "Angle 01",
    angle: "Schnellerer Start",
    hooks: [
      "72 Stunden vom Briefing zum ersten Setup",
      "Weniger Koordination bis zum ersten Review",
      "Aus einer Anfrage werden direkt umsetzbare Varianten",
    ],
    lengths: ["12s", "20s", "30s"],
  },
  {
    title: "Angle 02",
    angle: "Passende Rollen",
    hooks: [
      "Zynapse kuratiert das Setup statt offener Freelancer-Suche",
      "Die richtigen Spezialist:innen pro Kampagne statt Vollzeit-Hiring",
      "Klare Verantwortlichkeiten statt offener Schleifen",
    ],
    lengths: ["15s", "25s", "35s"],
  },
  {
    title: "Angle 03",
    angle: "Mehr Varianten pro Runde",
    hooks: [
      "Mehr kreative Wege aus einem abgestimmten Setup",
      "Varianten ohne neue Sourcing-Schleife",
      "Mehr Auswahl für Review und Paid Social",
    ],
    lengths: ["9s", "18s", "27s"],
  },
];

export const videoVariants: VideoVariantPreview[] = [
  { id: "v1", angle: "Schnellerer Start", hookTitle: "Erstes Setup in 72 Stunden", format: "9:16", length: "12s", objective: "Conversion" },
  { id: "v2", angle: "Schnellerer Start", hookTitle: "Vom Briefing in den ersten Review", format: "1:1", length: "20s", objective: "Awareness" },
  { id: "v3", angle: "Schnellerer Start", hookTitle: "Schneller launchen, früher lernen", format: "4:5", length: "30s", objective: "Retention" },
  { id: "v4", angle: "Passende Rollen", hookTitle: "Die richtigen Spezialist:innen pro Kampagne", format: "9:16", length: "15s", objective: "Conversion" },
  { id: "v5", angle: "Passende Rollen", hookTitle: "Brand-Kontext ohne Agentur-Bremse", format: "1:1", length: "25s", objective: "Awareness" },
  { id: "v6", angle: "Passende Rollen", hookTitle: "Ein Setup, klare Übergaben", format: "4:5", length: "35s", objective: "Retention" },
  { id: "v7", angle: "Mehr Varianten pro Runde", hookTitle: "Mehr Wege aus einem abgestimmten Setup", format: "9:16", length: "9s", objective: "Awareness" },
  { id: "v8", angle: "Mehr Varianten pro Runde", hookTitle: "Varianten schlagen Ratespiele", format: "1:1", length: "18s", objective: "Conversion" },
  { id: "v9", angle: "Mehr Varianten pro Runde", hookTitle: "Mehr Auswahl für Review und Paid Social", format: "4:5", length: "27s", objective: "Retention" },
  { id: "v10", angle: "Kampagnen-Handover", hookTitle: "Export mit Kontext statt Dateichaos", format: "9:16", length: "14s", objective: "Conversion" },
  { id: "v11", angle: "Kampagnen-Handover", hookTitle: "Freigaben zentral dokumentiert", format: "1:1", length: "22s", objective: "Awareness" },
  { id: "v12", angle: "Kampagnen-Handover", hookTitle: "Das Setup trägt die nächste Runde mit", format: "4:5", length: "32s", objective: "Retention" },
];

export const studioTimeline = [
  {
    title: "Eingabe",
    detail: "Ziel, Produkt, Guardrails, Budget, Kanal",
  },
  {
    title: "Setup",
    detail: "Rollen, Hooks, CTA-Routen, Freigaben, Produktionsplan",
  },
  {
    title: "Handover",
    detail: "Varianten, Versionen und Kontext für Review, Ads und nächste Iterationen",
  },
];
