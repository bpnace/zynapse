export type MarketingFaqItem = {
  question: string;
  answer: string;
};

export const marketingFaqItems = [
  {
    question: "Welche Botschaft trägt der erste Frame?",
    answer:
      "Zynapse Core leitet aus Zielgruppe, Produktnutzen und vorhandenem Material eine Hook-Hypothese ab. Der erste Frame bekommt eine klare Aufgabe: Aufmerksamkeit, Kontext, Proof oder Produktdetail.",
  },
  {
    question: "Welche Zielgruppe soll das Szenario erkennen?",
    answer:
      "Im Briefing werden Zielgruppe, Einwände und Kaufmoment verdichtet. Daraus entstehen Szenarien, die im Clip visuell erkennbar machen, für wen das Angebot gedacht ist.",
  },
  {
    question: "Welche Variante braucht ein anderes Format oder einen anderen Hook?",
    answer:
      "Zynapse trennt Motiv, Format, Hook und Funnel-Aufgabe. So wird sichtbar, ob ein Asset nur zugeschnitten werden muss oder ob eine neue Variante mit anderer Einstiegsidee sinnvoller ist.",
  },
  {
    question: "Welche Entscheidung muss vor der Übergabe noch im Review fallen?",
    answer:
      "Vor der Übergabe werden Freigabe, offene Annahmen, Testfrage und Media-Nutzung dokumentiert. Das Media-Team bekommt dadurch kein loses Video, sondern ein Creative Pack mit Review-Kontext.",
  },
] as const satisfies readonly MarketingFaqItem[];
