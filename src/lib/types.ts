import type { Database } from "@/integrations/supabase/types";

// Database types
export type Cluster = Database["public"]["Tables"]["clusters"]["Row"];
export type Minister = Database["public"]["Tables"]["ministers"]["Row"];
export type Agency = Database["public"]["Tables"]["agencies"]["Row"];
export type Policy = Database["public"]["Tables"]["policies"]["Row"];
export type Milestone = Database["public"]["Tables"]["milestones"]["Row"];
export type Budget = Database["public"]["Tables"]["budgets"]["Row"];
export type ProgressUpdate = Database["public"]["Tables"]["progress_updates"]["Row"];
export type PublicVote = Database["public"]["Tables"]["public_votes"]["Row"];
export type CommunityTip = Database["public"]["Tables"]["community_tips"]["Row"];

// Extended types with relations
export interface PolicyWithCluster extends Policy {
  clusters: Cluster | null;
}

export interface PolicyDetail extends Policy {
  clusters: Cluster | null;
  milestones: Milestone[];
  budgets: Budget[];
  progress_updates: ProgressUpdate[];
}

// KPI type
export interface KPI {
  metric: string;
  target: string;
  current: string;
  unit: string;
}

// Stats type
export interface DashboardStats {
  total: number;
  in_progress: number;
  completed: number;
  delayed_or_planned: number;
}

// Vote counts
export interface VoteCounts {
  trust: number;
  doubt: number;
  distrust: number;
  total: number;
}