import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";
import { getSession } from "@/lib/auth";
import { sendAdminNotification } from "@/lib/notifications";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession();
  
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("progress_updates")
        .select(`
          *,
          policies (
            id,
            title,
            policy_number
          )
        `)
        .eq("publish_status", "draft")
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.status(200).json(data || []);
    } catch (error) {
      console.error("Error fetching pending updates:", error);
      res.status(500).json({ error: "Failed to fetch updates" });
    }
  } else if (req.method === "POST") {
    try {
      const { policy_id, update_type, description, evidence_urls, data_source_type } = req.body;

      if (!policy_id || !update_type || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { data, error } = await supabase
        .from("progress_updates")
        .insert({
          policy_id,
          update_type,
          description,
          evidence_urls: evidence_urls || [],
          data_source_type: data_source_type || "manual",
          publish_status: "draft",
        })
        .select("id, policies(title)")
        .single();

      if (error) throw error;

      // Send email notification (non-blocking)
      const policyTitle = (data.policies as any)?.title || "นโยบาย";
      await sendAdminNotification({
        type: "progress_update",
        policy_title: policyTitle,
        description,
        admin_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/updates`,
      });

      res.status(200).json({ success: true, id: data.id });
    } catch (error) {
      console.error("Error creating update:", error);
      res.status(500).json({ error: "Failed to create update" });
    }
  } else if (req.method === "PATCH") {
    // Approve or reject an update
    const { update_id, action, reviewer_notes } = req.body;

    if (!update_id || !action) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const new_status = action === "approve" ? "published" : "draft";
    const published_at = action === "approve" ? new Date().toISOString() : null;

    const updateData: any = {
      publish_status: new_status,
      verified_by: session.user.id,
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
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}