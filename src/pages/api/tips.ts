import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";
import { createHash } from "crypto";

/**
 * Simple encryption for contact info (basic obfuscation)
 * For production, use proper encryption library
 */
function encryptContact(contact: string): string {
  if (!contact) return "";
  return createHash("sha256").update(contact + process.env.CONTACT_SALT || "policywatch-salt").digest("hex");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      policy_id,
      description,
      evidence_url,
      location_province,
      location_district,
      submitter_contact,
    } = req.body;

    // Validation
    if (!policy_id || !description) {
      return res.status(400).json({ error: "policy_id and description are required" });
    }

    if (description.length < 20) {
      return res.status(400).json({ error: "รายละเอียดเบาะแสต้องมีอย่างน้อย 20 ตัวอักษร" });
    }

    // Encrypt contact if provided
    const encrypted_contact = submitter_contact ? encryptContact(submitter_contact) : null;

    const { data, error } = await supabase
      .from("community_tips")
      .insert({
        policy_id,
        description,
        evidence_url: evidence_url || null,
        location_province: location_province || null,
        location_district: location_district || null,
        submitter_contact_encrypted: encrypted_contact,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating tip:", error);
      return res.status(500).json({ error: "Failed to submit tip" });
    }

    return res.status(201).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}