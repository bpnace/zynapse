import type { WorkspaceRole } from "@/lib/auth/roles";

export type CampaignStageKey =
  | "brief_received"
  | "setup_planned"
  | "production_ready"
  | "in_review"
  | "approved"
  | "handover_ready";

export type CampaignStageStatus = "pending" | "in_progress" | "completed";
export type AssetScope = "input" | "output";
export type AssetReviewStatus =
  | "pending"
  | "approved"
  | "changes_requested"
  | "rejected";
export type CommentType = "comment" | "change_request" | "approval_note";
export type BriefStatus = "draft" | "submitted";
export type PilotRequestStatus = "submitted" | "failed";
export type PilotRequestHandoffMode = "webhook" | "log";
export type OrganizationStatus = "invited" | "active" | "archived";

type TableDefinition<Row, Insert = Row, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type WorkspaceDatabase = {
  public: {
    Tables: {
      organizations: TableDefinition<
        {
          id: string;
          name: string;
          slug: string;
          industry: string | null;
          status: OrganizationStatus;
          created_at: string;
        },
        {
          id?: string;
          name: string;
          slug: string;
          industry?: string | null;
          status?: OrganizationStatus;
          created_at?: string;
        }
      >;
      invites: TableDefinition<
        {
          id: string;
          organization_id: string;
          email: string;
          role: WorkspaceRole;
          seed_template_key: string;
          expires_at: string;
          accepted_at: string | null;
        },
        {
          id?: string;
          organization_id: string;
          email: string;
          role: WorkspaceRole;
          seed_template_key: string;
          expires_at: string;
          accepted_at?: string | null;
        }
      >;
      memberships: TableDefinition<
        {
          id: string;
          organization_id: string;
          user_id: string;
          role: WorkspaceRole;
          invited_by: string | null;
          accepted_at: string;
        },
        {
          id?: string;
          organization_id: string;
          user_id: string;
          role: WorkspaceRole;
          invited_by?: string | null;
          accepted_at?: string;
        }
      >;
      brand_profiles: TableDefinition<
        {
          organization_id: string;
          website: string | null;
          offer_summary: string | null;
          target_audience: string | null;
          primary_channels: string | null;
          brand_tone: string | null;
          review_notes: string | null;
          claim_guardrails: string | null;
          updated_at: string;
        },
        {
          organization_id: string;
          website?: string | null;
          offer_summary?: string | null;
          target_audience?: string | null;
          primary_channels?: string | null;
          brand_tone?: string | null;
          review_notes?: string | null;
          claim_guardrails?: string | null;
          updated_at?: string;
        }
      >;
      campaigns: TableDefinition<
        {
          id: string;
          organization_id: string;
          brief_id: string | null;
          name: string;
          current_stage: CampaignStageKey | string;
          package_tier: string;
          seeded_template_key: string | null;
          campaign_goal: string | null;
          created_at: string;
        },
        {
          id?: string;
          organization_id: string;
          brief_id?: string | null;
          name: string;
          current_stage: CampaignStageKey | string;
          package_tier: string;
          seeded_template_key?: string | null;
          campaign_goal?: string | null;
          created_at?: string;
        }
      >;
      campaign_stages: TableDefinition<
        {
          id: string;
          campaign_id: string;
          stage_key: CampaignStageKey;
          stage_order: number;
          status: CampaignStageStatus;
          started_at: string | null;
          completed_at: string | null;
        },
        {
          id?: string;
          campaign_id: string;
          stage_key: CampaignStageKey;
          stage_order: number;
          status?: CampaignStageStatus;
          started_at?: string | null;
          completed_at?: string | null;
        }
      >;
      assets: TableDefinition<
        {
          id: string;
          campaign_id: string;
          brief_id: string | null;
          asset_scope: AssetScope;
          asset_type: string;
          title: string;
          format: string | null;
          duration_seconds: number | null;
          storage_path: string | null;
          thumbnail_path: string | null;
          source: string | null;
          version_label: string | null;
          review_status: AssetReviewStatus;
          created_at: string;
        },
        {
          id?: string;
          campaign_id: string;
          brief_id?: string | null;
          asset_scope?: AssetScope;
          asset_type: string;
          title: string;
          format?: string | null;
          duration_seconds?: number | null;
          storage_path?: string | null;
          thumbnail_path?: string | null;
          source?: string | null;
          version_label?: string | null;
          review_status?: AssetReviewStatus;
          created_at?: string;
        }
      >;
      review_threads: TableDefinition<
        {
          id: string;
          asset_id: string;
          created_by: string;
          anchor_json: string | null;
          resolved_at: string | null;
        },
        {
          id?: string;
          asset_id: string;
          created_by: string;
          anchor_json?: string | null;
          resolved_at?: string | null;
        }
      >;
      comments: TableDefinition<
        {
          id: string;
          thread_id: string;
          author_id: string;
          body: string;
          comment_type: CommentType;
          created_at: string;
        },
        {
          id?: string;
          thread_id: string;
          author_id: string;
          body: string;
          comment_type?: CommentType;
          created_at?: string;
        }
      >;
      briefs: TableDefinition<
        {
          id: string;
          organization_id: string;
          created_by: string;
          title: string;
          status: BriefStatus;
          objective: string;
          offer: string;
          audience: string;
          channels: string;
          references_json: string;
          budget_range: string;
          timeline: string;
          approval_notes: string;
          started_at: string;
          submitted_at: string | null;
        },
        {
          id?: string;
          organization_id: string;
          created_by: string;
          title: string;
          status?: BriefStatus;
          objective: string;
          offer: string;
          audience: string;
          channels: string;
          references_json: string;
          budget_range: string;
          timeline: string;
          approval_notes: string;
          started_at?: string;
          submitted_at?: string | null;
        }
      >;
      pilot_requests: TableDefinition<
        {
          id: string;
          organization_id: string;
          campaign_id: string;
          requested_by: string;
          desired_tier: string;
          start_window: string;
          internal_stakeholders: string | null;
          message: string;
          status: PilotRequestStatus;
          handoff_mode: PilotRequestHandoffMode;
          submitted_at: string;
        },
        {
          id?: string;
          organization_id: string;
          campaign_id: string;
          requested_by: string;
          desired_tier: string;
          start_window: string;
          internal_stakeholders?: string | null;
          message: string;
          status?: PilotRequestStatus;
          handoff_mode: PilotRequestHandoffMode;
          submitted_at?: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: {
      workspace_login_eligible: {
        Args: {
          target_email: string;
        };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type TableRow<
  T extends keyof WorkspaceDatabase["public"]["Tables"],
> = WorkspaceDatabase["public"]["Tables"][T]["Row"];
