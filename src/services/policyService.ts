import { supabase } from "@/integrations/supabase/client";
import type { Policy, PolicyWithDetails, PolicyDetail } from "@/lib/types";

/**
 * Fetch all policies with cluster info
 */
export async function getAllPolicies(): Promise<PolicyWithDetails[]> {
  const { data, error } = await supabase
    .from("policies")
    .select(`
      *,
      clusters (*),
      ministers (*)
    `)
    .order("policy_number");

  if (error) {
    console.error("Error fetching policies:", error);
    return [];
  }

  return (data || []) as unknown as PolicyWithDetails[];
}

/**
 * Get policies by cluster
 */
export async function getPoliciesByCluster(clusterId: number): Promise<PolicyWithDetails[]> {
  const { data, error } = await supabase
    .from("policies")
    .select(`
      *,
      clusters (*),
      ministers (*)
    `)
    .eq("cluster_id", clusterId)
    .order("policy_number");

  if (error) {
    console.error("Error fetching policies by cluster:", error);
    return [];
  }

  return (data || []) as unknown as PolicyWithDetails[];
}

/**
 * Fetch featured policies (urgent + is_featured = true)
 */
export async function getFeaturedPolicies(): Promise<PolicyWithDetails[]> {
  const { data, error } = await supabase
    .from("policies")
    .select(`
      *,
      clusters (*),
      ministers (*)
    `)
    .eq("is_featured", true)
    .order("priority", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching featured policies:", error);
    return [];
  }

  return (data || []) as unknown as PolicyWithDetails[];
}

/**
 * Fetch policy detail by slug
 */
export async function getPolicyBySlug(slug: string): Promise<PolicyDetail | null> {
  const { data, error } = await supabase
    .from("policies")
    .select(`
      *,
      clusters (
        id,
        name,
        short_name,
        color_hex,
        icon
      ),
      ministers (
        id,
        full_name,
        title,
        position
      ),
      milestones (
        id,
        name,
        milestone_order,
        weight_percent,
        status,
        target_date,
        completed_date,
        notes
      ),
      progress_updates (
        id,
        update_type,
        description,
        old_status,
        new_status,
        evidence_urls,
        data_source_type,
        created_at
      ),
      budgets (*)
    `)
    .eq("slug", slug)
    .eq("progress_updates.publish_status", "published")
    .order("milestone_order", { foreignTable: "milestones" })
    .order("created_at", { foreignTable: "progress_updates", ascending: false })
    .single();

  if (error) {
    console.error("Error fetching policy:", error);
    return null;
  }

  // Ensure related data are correctly typed as arrays
  const policyDetail: PolicyDetail = {
    ...(data as any),
    milestones: Array.isArray(data.milestones) ? data.milestones : [],
    progress_updates: Array.isArray(data.progress_updates) ? data.progress_updates : [],
    budgets: Array.isArray(data.budgets) ? data.budgets : [],
  };

  return policyDetail;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  const { data, error } = await supabase
    .from("policies")
    .select("status");

  const { count: pendingUpdates } = await supabase
    .from("progress_updates")
    .select("*", { count: "exact", head: true })
    .in("publish_status", ["draft", "under_review"]);

  const { count: pendingTips } = await supabase
    .from("community_tips")
    .select("*", { count: "exact", head: true })
    .in("status", ["new", "under_review"]);

  if (error) {
    console.error("Error fetching stats:", error);
    return {
      total: 0,
      in_progress: 0,
      completed: 0,
      delayed_or_planned: 0,
      pending_updates: 0,
      pending_tips: 0,
    };
  }

  const total = data?.length || 0;
  const in_progress = data?.filter(p => p.status === "in_progress").length || 0;
  const completed = data?.filter(p => p.status === "completed").length || 0;
  const delayed_or_planned = data?.filter(p => 
    p.status === "delayed" || p.status === "planned"
  ).length || 0;

  return {
    total,
    in_progress,
    completed,
    delayed_or_planned,
    pending_updates: pendingUpdates || 0,
    pending_tips: pendingTips || 0,
  };
}