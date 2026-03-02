import type { CampaignAngle, VideoVariantPreview } from "@/types/site";

export const campaignAngles: CampaignAngle[] = [
  {
    title: "Angle 01",
    angle: "Zeit bis Ergebnis",
    hooks: [
      "72 Stunden von Briefing bis freigabebereit",
      "Weniger Produktions-Deadlines, mehr getestete Creatives",
      "Aus einem Briefing werden direkt testbare Assets",
    ],
    lengths: ["12s", "20s", "30s"],
  },
  {
    title: "Angle 02",
    angle: "Rollenklarheit",
    hooks: [
      "Die Marke liefert Kontext, nicht Produktionschaos",
      "Manager steuert Strategie, Studio skaliert die Ausführung",
      "Klare Verantwortlichkeiten statt offener Schleifen",
    ],
    lengths: ["15s", "25s", "35s"],
  },
  {
    title: "Angle 03",
    angle: "Gegenmittel für Creative Fatigue",
    hooks: [
      "Hook-Stacks statt Einzelvideos",
      "Creative Testing ohne Creator-Sourcing-Schleife",
      "Mehr Varianten, weniger Burnout im Team",
    ],
    lengths: ["9s", "18s", "27s"],
  },
];

export const videoVariants: VideoVariantPreview[] = [
  { id: "v1", angle: "Zeit bis Ergebnis", hookTitle: "Fertig in 72 Stunden", format: "9:16", length: "12s", objective: "Conversion" },
  { id: "v2", angle: "Zeit bis Ergebnis", hookTitle: "Vom Briefing bis Launch", format: "1:1", length: "20s", objective: "Awareness" },
  { id: "v3", angle: "Zeit bis Ergebnis", hookTitle: "Schneller launchen, früher testen", format: "4:5", length: "30s", objective: "Retention" },
  { id: "v4", angle: "Rollenklarheit", hookTitle: "Der Manager führt die Strategie", format: "9:16", length: "15s", objective: "Conversion" },
  { id: "v5", angle: "Rollenklarheit", hookTitle: "Markenkontext ohne Agentur-Bremse", format: "1:1", length: "25s", objective: "Awareness" },
  { id: "v6", angle: "Rollenklarheit", hookTitle: "Ein Workflow, klare Übergaben", format: "4:5", length: "35s", objective: "Retention" },
  { id: "v7", angle: "Gegenmittel für Creative Fatigue", hookTitle: "Schluss mit wöchentlichem Content-Stress", format: "9:16", length: "9s", objective: "Awareness" },
  { id: "v8", angle: "Gegenmittel für Creative Fatigue", hookTitle: "Varianten schlagen Ratespiele", format: "1:1", length: "18s", objective: "Conversion" },
  { id: "v9", angle: "Gegenmittel für Creative Fatigue", hookTitle: "Hook-Stacks statt Einzelstücke", format: "4:5", length: "27s", objective: "Retention" },
  { id: "v10", angle: "Studio-System", hookTitle: "Gebaut für den Ads-Manager-Export", format: "9:16", length: "14s", objective: "Conversion" },
  { id: "v11", angle: "Studio-System", hookTitle: "Freigabe vor Veröffentlichung", format: "1:1", length: "22s", objective: "Awareness" },
  { id: "v12", angle: "Studio-System", hookTitle: "Kampagnenlogik vor Footage", format: "4:5", length: "32s", objective: "Retention" },
];

export const studioTimeline = [
  {
    title: "Eingabe",
    detail: "Produkt, Ziel, Tonalität, Budget, Kanal",
  },
  {
    title: "Kampagnen-Pack",
    detail: "Angles, Hooks, CTA-Bibliothek, Testing-Plan",
  },
  {
    title: "Ergebnis",
    detail: "Mehrere Cuts, Längen, Platzierungen und Export-Versionen",
  },
];
