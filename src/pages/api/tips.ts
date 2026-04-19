import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";
import { sendAdminNotification } from "@/lib/notifications";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { policy_id, name, description } = req.body;

    if (!policy_id || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert community tip
    const { data, error } = await supabase
      .from("community_tips")
      .insert({
        policy_id,
        name: name || "ผู้ส่งข้อมูล",
        description,
        status: "pending",
      })
      .select("id, policies(title)")
      .single();

    if (error) {
      console.error("Error inserting tip:", error);
      return res.status(500).json({ error: "Failed to submit tip" });
    }

    // Send email notification (non-blocking)
    const policyTitle = (data.policies as any)?.title || "นโยบาย";
    await sendAdminNotification({
      type: "community_tip",
      policy_title: policyTitle,
      description,
      submitter_name: name || "ผู้ส่งข้อมูล",
      admin_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/tips`,
    });

    res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}