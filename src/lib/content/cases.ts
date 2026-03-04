import type { CaseStudyEntry } from "@/types/site";

export const caseStudies: CaseStudyEntry[] = [
  {
    slug: "nova-bloom",
    brand: "Nova Bloom",
    sector: "Beauty / D2C Demo",
    summary:
      "Launch-Setup mit testbaren Hooks auf TikTok und Reels für ein neues Beauty-Produkt.",
    challenge:
      "Das Team brauchte für einen Produktlaunch eine klare Teststruktur, ohne dass interne Freigaben zum Flaschenhals werden.",
    outcome:
      "Das Beispiel zeigt, wie aus einem Briefing drei Messaging-Linien, mehrere Hook-Routen und eine saubere Review-Spur entstehen können.",
    metrics: ["72h Go-live", "18 Varianten", "3 Kernangles"],
  },
  {
    slug: "ember-studio",
    brand: "Ember Studio",
    sector: "Fashion / Demo",
    summary:
      "Premium-Look trifft Performance: Varianten für Paid Social ohne generische Fließbandware.",
    challenge:
      "Die Marke wollte mehr Variationen für Paid Social, ohne den Look in generische Creative-Fließbandware zu verwandeln.",
    outcome:
      "Das Beispiel zeigt, wie ein Manager die Kampagnenlogik führen und das Studio daraus mehrere Cuts, Formate und Review-Schleifen ableiten kann.",
    metrics: ["4:5 + 9:16", "12 Varianten", "2 Review-Zyklen"],
  },
  {
    slug: "signal-loop",
    brand: "Signal Loop",
    sector: "B2B SaaS / Demo",
    summary:
      "Komplexes B2B-Produkt in klare Demo- und Awareness-Creatives für Paid Social übersetzt.",
    challenge:
      "Das Team brauchte kurze Erklärformate für Paid Social, ohne jedes Asset jedes Mal neu aufzusetzen.",
    outcome:
      "Das Beispiel zeigt, wie aus einem komplexen Briefing ein Kampagnen-Pack mit Segment-, CTA- und Formatlogik entstehen kann.",
    metrics: ["6 Formate", "5 CTA-Varianten", "1 Review-Runde"],
  },
];
