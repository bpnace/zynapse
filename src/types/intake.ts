export type BrandInquiry = {
  industry: string;
  productUrl: string;
  goal: string;
  channels: string[];
  budgetRange: string;
  timeline: string;
  notes: string;
  contactName: string;
  workEmail: string;
  company: string;
  datenschutzAccepted: boolean;
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
  datenschutzAccepted: boolean;
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
  datenschutzAccepted: boolean;
  startedAt: number;
  website: string;
};

export type WaitlistWebhookSource =
  | "waitlist_signup"
  | "brand_inquiry"
  | "creative_application";

export type WaitlistWebhookEnvironment = "development" | "production";

export type WaitlistWebhookContact = {
  email: string;
  name?: string;
  company?: string;
};

export type WaitlistWebhookEnvelope<
  TRaw extends Record<string, unknown> = Record<string, unknown>,
> = {
  source: WaitlistWebhookSource;
  env: WaitlistWebhookEnvironment;
  timestamp: string;
  userAgent: string;
  origin: string;
  siteUrl: string;
  contact: WaitlistWebhookContact;
  raw: TRaw;
};
