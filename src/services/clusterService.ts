import { supabase } from "@/integrations/supabase/client";
import type { Cluster } from "@/lib/types";

/**
 * Fetch all clusters
 */
export async function getAllClusters(): Promise<Cluster[]> {
  const { data, error } = await supabase
    .from("clusters")
    .select("*")
    .order("id", { ascending: true });

  console.log("getAllClusters:", { data, error });
  
  if (error) {
    console.error("Error fetching clusters:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Get cluster with policy count
 */
export async function getClustersWithCount(): Promise<(Cluster & { policy_count: number })[]> {
  const { data: clusters, error: clusterError } = await supabase
    .from("clusters")
    .select("*")
    .order("id", { ascending: true });

  if (clusterError) {
    console.error("Error fetching clusters:", clusterError);
    return [];
  }

  const { data: policies, error: policyError } = await supabase
    .from("policies")
    .select("cluster_id");

  if (policyError) {
    console.error("Error fetching policies:", policyError);
    return (clusters || []).map(c => ({ ...c, policy_count: 0 }));
  }

  return (clusters || []).map(cluster => ({
    ...cluster,
    policy_count: (policies || []).filter(p => p.cluster_id === cluster.id).length
  }));
}