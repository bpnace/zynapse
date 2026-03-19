export type IntakeKind = "brand" | "creative" | "contact";

export type IntakeEnvelope<TPayload> = {
  kind: IntakeKind;
  origin: string;
  submittedAt: string;
  notifyEmail: string;
  siteUrl: string;
  payload: TPayload;
};

export type IntakeResult = {
  mode: "webhook" | "log";
  accepted: boolean;
};
