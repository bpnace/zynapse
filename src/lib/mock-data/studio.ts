import type { CampaignAngle, VideoVariantPreview } from "@/types/site";

export const campaignAngles: CampaignAngle[] = [
  {
    title: "Angle 01",
    angle: "Time-to-result",
    hooks: [
      "72 Stunden von Brief bis Review-ready",
      "Weniger Produktions-Deadlines, mehr getestete Creatives",
      "Aus einem Brief werden direkt testbare Assets",
    ],
    lengths: ["12s", "20s", "30s"],
  },
  {
    title: "Angle 02",
    angle: "Role clarity",
    hooks: [
      "Brand liefert Kontext, nicht Produktionschaos",
      "Manager steuert Strategie, Studio skaliert die Ausführung",
      "Klare Verantwortlichkeiten statt offenen Loops",
    ],
    lengths: ["15s", "25s", "35s"],
  },
  {
    title: "Angle 03",
    angle: "Creative fatigue antidote",
    hooks: [
      "Hook-Stacks statt Einzelvideos",
      "Creative Testing ohne Creator-Sourcing-Schleife",
      "Mehr Varianten, weniger Burnout im Team",
    ],
    lengths: ["9s", "18s", "27s"],
  },
];

export const videoVariants: VideoVariantPreview[] = [
  { id: "v1", angle: "Time-to-result", hookTitle: "Ready in 72h", format: "9:16", length: "12s", objective: "Conversion" },
  { id: "v2", angle: "Time-to-result", hookTitle: "From brief to live", format: "1:1", length: "20s", objective: "Awareness" },
  { id: "v3", angle: "Time-to-result", hookTitle: "Launch faster, test sooner", format: "4:5", length: "30s", objective: "Retention" },
  { id: "v4", angle: "Role clarity", hookTitle: "The manager owns the strategy", format: "9:16", length: "15s", objective: "Conversion" },
  { id: "v5", angle: "Role clarity", hookTitle: "Brand context without agency drag", format: "1:1", length: "25s", objective: "Awareness" },
  { id: "v6", angle: "Role clarity", hookTitle: "One workflow, clear handoffs", format: "4:5", length: "35s", objective: "Retention" },
  { id: "v7", angle: "Creative fatigue antidote", hookTitle: "Break the weekly content scramble", format: "9:16", length: "9s", objective: "Awareness" },
  { id: "v8", angle: "Creative fatigue antidote", hookTitle: "Variants beat guesswork", format: "1:1", length: "18s", objective: "Conversion" },
  { id: "v9", angle: "Creative fatigue antidote", hookTitle: "Hook stacks, not one-offs", format: "4:5", length: "27s", objective: "Retention" },
  { id: "v10", angle: "Studio system", hookTitle: "Built for Ads Manager export", format: "9:16", length: "14s", objective: "Conversion" },
  { id: "v11", angle: "Studio system", hookTitle: "Review before it ships", format: "1:1", length: "22s", objective: "Awareness" },
  { id: "v12", angle: "Studio system", hookTitle: "Campaign logic before footage", format: "4:5", length: "32s", objective: "Retention" },
];

export const studioTimeline = [
  {
    title: "Input",
    detail: "Produkt, Ziel, Tonalität, Budget, Kanal",
  },
  {
    title: "Campaign Pack",
    detail: "Angles, Hooks, CTA-Library, Testing Plan",
  },
  {
    title: "Output",
    detail: "Mehrere Cuts, Längen, Platzierungen und Export-Versionen",
  },
];
