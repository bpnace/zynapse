export type BrandInquiry = {
  industry: string;
  productUrl: string;
  goal: string;
  channel: string;
  budgetRange: string;
  timeline: string;
  notes: string;
  contactName: string;
  workEmail: string;
  company: string;
  startedAt: number;
  website: string;
};

export type CreativeApplication = {
  name: string;
  email: string;
  portfolioUrl: string;
  focusChannels: string[];
  caseSummary: string;
  availability: string;
  compensationNotes: string;
  location: string;
  startedAt: number;
  website: string;
};

export type ContactInquiry = {
  name: string;
  email: string;
  company: string;
  teamContext: string;
  topic: string;
  message: string;
  startedAt: number;
  website: string;
};
