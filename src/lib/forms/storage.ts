import type { BrandInquiry, ContactInquiry, CreativeApplication } from "@/types/intake";

export const BRAND_INQUIRY_STORAGE_KEY = "zynapse-brand-inquiry";
export const CREATIVE_APPLICATION_STORAGE_KEY = "zynapse-creative-application";

export function createBrandInquiryDefaults(
  seed: Partial<BrandInquiry> = {},
): BrandInquiry {
  return {
    industry: "",
    productUrl: "",
    goal: "",
    channel: "",
    budgetRange: "",
    timeline: "",
    notes: "",
    contactName: "",
    workEmail: "",
    company: "",
    startedAt: Date.now(),
    website: "",
    ...seed,
  };
}

export function createCreativeApplicationDefaults(
  seed: Partial<CreativeApplication> = {},
): CreativeApplication {
  return {
    name: "",
    email: "",
    portfolioUrl: "",
    focusChannels: [],
    caseSummary: "",
    availability: "",
    compensationNotes: "",
    location: "",
    startedAt: Date.now(),
    website: "",
    ...seed,
  };
}

export function createContactInquiryDefaults(
  seed: Partial<ContactInquiry> = {},
): ContactInquiry {
  return {
    name: "",
    email: "",
    company: "",
    teamContext: "",
    topic: "",
    message: "",
    datenschutzAccepted: false,
    startedAt: Date.now(),
    website: "",
    ...seed,
  };
}
