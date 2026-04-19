import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check auth
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    // Get all updates pending review
    const { data, error } = await supabase
      .from("progress_updates")
      .select(`
        *,
        policies (
          id,
          title,
          policy_number,
          slug
        )
      `)
      .in("publish_status", ["draft", "under_review"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching updates:", error);
      return res.status(500).json({ error: "Failed to fetch updates" });
    }

    return res.status(200).json(data || []);
  }

  if (req.method === "PATCH") {
    // Approve or reject an update
    const { update_id, action, reviewer_notes } = req.body;

    if (!update_id || !action) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const new_status = action === "approve" ? "published" : "draft";
    const published_at = action === "approve" ? new Date().toISOString() : null;

    const updateData: any = {
      publish_status: new_status,
      verified_by: user.id,
    };

    if (published_at) {
      updateData.published_at = published_at;
    }

    const { data, error } = await supabase
      .from("progress_updates")
      .update(updateData)
      .eq("id", update_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating progress update:", error);
      return res.status(500).json({ error: "Failed to update" });
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}