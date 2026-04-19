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
export type WorkspaceType = "brand" | "creative" | "ops";
export type MembershipStatus = "invited" | "active" | "paused" | "archived";
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
export type AssignmentRole =
  | "creative"
  | "creative_lead"
  | "editor"
  | "motion"
  | "designer"
  | "copy";
export type AssignmentStatus =
  | "assigned"
  | "accepted"
  | "in_progress"
  | "blocked"
  | "submitted"
  | "completed";
export type CreativeTaskType = "concept" | "production" | "revision" | "delivery";
export type CreativeTaskStatus =
  | "todo"
  | "in_progress"
  | "blocked"
  | "submitted"
  | "completed";
export type CreativeTaskPriority = "low" | "medium" | "high";
export type AssetVersionStatus =
  | "draft"
  | "submitted_for_ops_review"
  | "submitted_for_brand_review"
  | "approved"
  | "rejected";
export type RevisionItemStatus = "open" | "submitted" | "resolved";

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
          workspace_type: WorkspaceType;
          membership_status: MembershipStatus;
          invited_by: string | null;
          accepted_at: string;
        },
        {
          id?: string;
          organization_id: string;
          user_id: string;
          role: WorkspaceRole;
          workspace_type?: WorkspaceType;
          membership_status?: MembershipStatus;
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
      creative_profiles: TableDefinition<
        {
          id: string;
          user_id: string;
          slug: string;
          display_name: string;
          headline: string | null;
          bio: string | null;
          specialties: string | null;
          portfolio_url: string | null;
          availability_status: string;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          slug: string;
          display_name: string;
          headline?: string | null;
          bio?: string | null;
          specialties?: string | null;
          portfolio_url?: string | null;
          availability_status?: string;
          created_at?: string;
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
      campaign_assignments: TableDefinition<
        {
          id: string;
          campaign_id: string;
          user_id: string;
          assignment_role: AssignmentRole;
          status: AssignmentStatus;
          assigned_by: string | null;
          scope_summary: string | null;
          due_at: string | null;
          accepted_at: string | null;
          submitted_at: string | null;
          created_at: string;
        },
        {
          id?: string;
          campaign_id: string;
          user_id: string;
          assignment_role?: AssignmentRole;
          status?: AssignmentStatus;
          assigned_by?: string | null;
          scope_summary?: string | null;
          due_at?: string | null;
          accepted_at?: string | null;
          submitted_at?: string | null;
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
      creative_tasks: TableDefinition<
        {
          id: string;
          campaign_id: string;
          assignment_id: string | null;
          asset_id: string | null;
          owner_user_id: string;
          title: string;
          description: string | null;
          task_type: CreativeTaskType;
          status: CreativeTaskStatus;
          priority: CreativeTaskPriority;
          blocked_reason: string | null;
          due_at: string | null;
          submitted_at: string | null;
          completed_at: string | null;
          created_at: string;
        },
        {
          id?: string;
          campaign_id: string;
          assignment_id?: string | null;
          asset_id?: string | null;
          owner_user_id: string;
          title: string;
          description?: string | null;
          task_type?: CreativeTaskType;
          status?: CreativeTaskStatus;
          priority?: CreativeTaskPriority;
          blocked_reason?: string | null;
          due_at?: string | null;
          submitted_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
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
      asset_versions: TableDefinition<
        {
          id: string;
          asset_id: string;
          campaign_id: string;
          assignment_id: string | null;
          created_by: string;
          version_label: string;
          storage_path: string;
          thumbnail_path: string | null;
          notes: string | null;
          submission_status: AssetVersionStatus;
          created_at: string;
        },
        {
          id?: string;
          asset_id: string;
          campaign_id: string;
          assignment_id?: string | null;
          created_by: string;
          version_label: string;
          storage_path: string;
          thumbnail_path?: string | null;
          notes?: string | null;
          submission_status?: AssetVersionStatus;
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
      revision_items: TableDefinition<
        {
          id: string;
          campaign_id: string;
          assignment_id: string | null;
          asset_id: string | null;
          review_thread_id: string | null;
          source_comment_id: string | null;
          created_by: string | null;
          title: string;
          detail: string;
          status: RevisionItemStatus;
          priority: CreativeTaskPriority;
          created_at: string;
          resolved_at: string | null;
        },
        {
          id?: string;
          campaign_id: string;
          assignment_id?: string | null;
          asset_id?: string | null;
          review_thread_id?: string | null;
          source_comment_id?: string | null;
          created_by?: string | null;
          title: string;
          detail: string;
          status?: RevisionItemStatus;
          priority?: CreativeTaskPriority;
          created_at?: string;
          resolved_at?: string | null;
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

export type TableRow<T extends keyof WorkspaceDatabase["public"]["Tables"]> =
  WorkspaceDatabase["public"]["Tables"][T]["Row"];
