import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Auth check
  try {
    await getCurrentUser();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    // Get all tips for review
    const { data, error } = await supabase
      .from("community_tips")
      .select(`
        *,
        policies (
          id,
          policy_number,
          title,
          slug
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tips:", error);
      return res.status(500).json({ error: "Failed to fetch tips" });
    }

    return res.status(200).json(data || []);
  }

  if (req.method === "PUT") {
    // Approve or reject tip
    const { id, action, reviewer_notes } = req.body;

    if (!id || !action) {
      return res.status(400).json({ error: "id and action are required" });
    }

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ error: "action must be 'approve' or 'reject'" });
    }

    const user = await getCurrentUser();

    const updateData: any = {
      status: action === "approve" ? "verified_published" : "rejected",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    };

    if (reviewer_notes) {
      updateData.reviewer_notes = reviewer_notes;
    }

    const { data, error } = await supabase
      .from("community_tips")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating tip:", error);
      return res.status(500).json({ error: "Failed to update tip" });
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}