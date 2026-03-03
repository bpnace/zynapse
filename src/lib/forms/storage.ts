import type { BrandInquiry, ContactInquiry, ManagerApplication } from "@/types/intake";

export const BRAND_INQUIRY_STORAGE_KEY = "zynapse-brand-inquiry";
export const MANAGER_APPLICATION_STORAGE_KEY = "zynapse-manager-application";

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

export function createManagerApplicationDefaults(
  seed: Partial<ManagerApplication> = {},
): ManagerApplication {
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
    startedAt: Date.now(),
    website: "",
    ...seed,
  };
}
