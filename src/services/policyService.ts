import { supabase } from "@/integrations/supabase/client";
import type { Policy, PolicyWithCluster, PolicyDetail, DashboardStats } from "@/lib/types";

/**
 * Fetch all policies with cluster info
 */
export async function getAllPolicies(): Promise<PolicyWithCluster[]> {
  const { data, error } = await supabase
    .from("policies")
    .select("*, clusters(*)")
    .order("policy_number", { ascending: true });

  console.log("getAllPolicies:", { data, error });
  
  if (error) {
    console.error("Error fetching policies:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Fetch featured policies (urgent + is_featured = true)
 */
export async function getFeaturedPolicies(): Promise<PolicyWithCluster[]> {
  const { data, error } = await supabase
    .from("policies")
    .select("*, clusters(*)")
    .eq("is_featured", true)
    .order("priority", { ascending: false });

  console.log("getFeaturedPolicies:", { data, error });
  
  if (error) {
    console.error("Error fetching featured policies:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Fetch policy detail by slug
 */
export async function getPolicyBySlug(slug: string): Promise<PolicyDetail | null> {
  const { data, error } = await supabase
    .from("policies")
    .select(`
      *,
      clusters(*),
      milestones(*),
      budgets(*),
      progress_updates(*)
    `)
    .eq("slug", slug)
    .single();

  console.log("getPolicyBySlug:", { data, error });
  
  if (error) {
    console.error("Error fetching policy:", error);
    return null;
  }
  
  return data as PolicyDetail;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { data, error } = await supabase
    .from("policies")
    .select("status");

  console.log("getDashboardStats:", { data, error });
  
  if (error) {
    console.error("Error fetching stats:", error);
    return { total: 0, in_progress: 0, completed: 0, delayed_or_planned: 0 };
  }
  
  const policies = data || [];
  const total = policies.length;
  const in_progress = policies.filter(p => p.status === "in_progress").length;
  const completed = policies.filter(p => p.status === "completed").length;
  const delayed_or_planned = policies.filter(p => p.status === "delayed" || p.status === "planned").length;
  
  return { total, in_progress, completed, delayed_or_planned };
}

/**
 * Get policies by cluster
 */
export async function getPoliciesByCluster(clusterId: number): Promise<PolicyWithCluster[]> {
  const { data, error } = await supabase
    .from("policies")
    .select("*, clusters(*)")
    .eq("cluster_id", clusterId)
    .order("priority", { ascending: false });

  console.log("getPoliciesByCluster:", { data, error });
  
  if (error) {
    console.error("Error fetching policies by cluster:", error);
    return [];
  }
  
  return data || [];
}