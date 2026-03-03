export type IntakeKind = "brand" | "manager" | "contact";

export type IntakeEnvelope<TPayload> = {
  kind: IntakeKind;
  submittedAt: string;
  notifyEmail: string;
  siteUrl: string;
  payload: TPayload;
};

export type IntakeResult = {
  mode: "webhook" | "log";
  accepted: boolean;
};
