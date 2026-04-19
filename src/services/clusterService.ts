import { supabase } from "@/integrations/supabase/client";
import type { Cluster } from "@/lib/types";

/**
 * Fetch all clusters
 */
export async function getAllClusters(): Promise<Cluster[]> {
  const { data, error } = await supabase
    .from("clusters")
    .select("*")
    .order("id");

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
  const clusters = await getAllClusters();
  
  const { data: policies, error } = await supabase
    .from("policies")
    .select("id, cluster_id, status");

  if (error) {
    console.error("Error fetching policies:", error);
    return clusters.map(cluster => ({ ...cluster, policy_count: 0 }));
  }

  return clusters.map(cluster => ({
    ...cluster,
    policy_count: (policies || []).filter(p => p.cluster_id === cluster.id).length
  }));
}

/**
 * Get cluster by ID
 */
export async function getClusterById(id: number): Promise<Cluster | null> {
  const { data, error } = await supabase
    .from("clusters")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching cluster:", error);
    return null;
  }

  return data;
}

/**
 * Get cluster stats
 */
export async function getClusterStats(clusterId: number) {
  const { data: policies, error } = await supabase
    .from("policies")
    .select("status, progress_percent")
    .eq("cluster_id", clusterId);

  if (error) {
    console.error("Error fetching cluster stats:", error);
    return {
      total: 0,
      planned: 0,
      in_progress: 0,
      completed: 0,
      delayed: 0,
      cancelled: 0,
      avg_progress: 0,
    };
  }

  const total = policies?.length || 0;
  const planned = policies?.filter(p => p.status === "planned").length || 0;
  const in_progress = policies?.filter(p => p.status === "in_progress").length || 0;
  const completed = policies?.filter(p => p.status === "completed").length || 0;
  const delayed = policies?.filter(p => p.status === "delayed").length || 0;
  const cancelled = policies?.filter(p => p.status === "cancelled").length || 0;
  
  const avg_progress = total > 0
    ? policies.reduce((sum, p) => sum + (Number(p.progress_percent) || 0), 0) / total
    : 0;

  return {
    total,
    planned,
    in_progress,
    completed,
    delayed,
    cancelled,
    avg_progress: Math.round(avg_progress * 10) / 10,
  };
}