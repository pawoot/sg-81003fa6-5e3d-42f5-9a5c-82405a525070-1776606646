import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Create authenticated Supabase client with session from request
function getAuthenticatedClient(req: NextApiRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  // Get session token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  
  // Create client with auth header
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });
  
  return client;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = getAuthenticatedClient(req);
  
  // Verify authentication using getUser (validates JWT token directly)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Auth error:", authError);
    return res.status(401).json({ error: "Unauthorized" });
  }

  // CREATE
  if (req.method === "POST") {
    const { policy, milestones } = req.body;

    // Insert policy
    const { data: policyData, error: policyError } = await supabase
      .from("policies")
      .insert([policy])
      .select()
      .single();

    if (policyError) {
      console.error("Error creating policy:", policyError);
      return res.status(500).json({ error: policyError.message });
    }

    // Insert milestones if provided
    if (milestones && milestones.length > 0) {
      const milestonesWithPolicyId = milestones.map((m: any) => ({
        ...m,
        policy_id: policyData.id,
      }));

      const { error: milestonesError } = await supabase
        .from("milestones")
        .insert(milestonesWithPolicyId);

      if (milestonesError) {
        console.error("Error creating milestones:", milestonesError);
        // Policy created but milestones failed - log but don't fail
      }
    }

    return res.status(201).json(policyData);
  }

  // UPDATE
  if (req.method === "PUT") {
    const { id, policy, milestones } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing policy id" });
    }

    // Update policy
    const { data: policyData, error: policyError } = await supabase
      .from("policies")
      .update(policy)
      .eq("id", id)
      .select()
      .single();

    if (policyError) {
      console.error("Error updating policy:", policyError);
      return res.status(500).json({ error: policyError.message });
    }

    // Handle milestones update (delete old, insert new)
    if (milestones) {
      // Delete existing milestones
      await supabase.from("milestones").delete().eq("policy_id", id);

      // Insert new milestones
      if (milestones.length > 0) {
        const milestonesWithPolicyId = milestones.map((m: any) => ({
          ...m,
          policy_id: id,
        }));

        const { error: milestonesError } = await supabase
          .from("milestones")
          .insert(milestonesWithPolicyId);

        if (milestonesError) {
          console.error("Error updating milestones:", milestonesError);
        }
      }
    }

    return res.status(200).json(policyData);
  }

  // DELETE
  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Missing policy id" });
    }

    const { error } = await supabase.from("policies").delete().eq("id", id);

    if (error) {
      console.error("Error deleting policy:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}