import type { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "crypto";
import { supabase } from "@/integrations/supabase/client";

// Hash IP address with date salt for daily uniqueness
function hashIP(ip: string): string {
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const salt = "policywatch-thailand-2026";
  return createHash("sha256")
    .update(`${ip}-${date}-${salt}`)
    .digest("hex");
}

// Get client IP from request headers
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? (typeof forwarded === "string" ? forwarded.split(",")[0] : forwarded[0])
    : req.socket.remoteAddress || "127.0.0.1";
  return ip.trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Submit a vote
    const { policy_id, vote } = req.body;

    if (!policy_id || !vote) {
      return res.status(400).json({ error: "Missing policy_id or vote" });
    }

    if (!["trust", "doubt", "distrust"].includes(vote)) {
      return res.status(400).json({ error: "Invalid vote value" });
    }

    const ip = getClientIP(req);
    const ip_hash = hashIP(ip);

    // Insert vote (will fail if duplicate due to unique constraint)
    const { error } = await supabase
      .from("public_votes")
      .insert({ policy_id, vote, ip_hash });

    if (error) {
      // Check if it's a duplicate vote
      if (error.code === "23505") {
        return res.status(409).json({ error: "คุณได้โหวตนโยบายนี้แล้ววันนี้" });
      }
      console.error("Vote insert error:", error);
      return res.status(500).json({ error: "Failed to submit vote" });
    }

    return res.status(201).json({ success: true });
  }

  if (req.method === "GET") {
    // Get vote counts for a policy
    const { policy_id } = req.query;

    if (!policy_id) {
      return res.status(400).json({ error: "Missing policy_id" });
    }

    const { data, error } = await supabase
      .from("public_votes")
      .select("vote")
      .eq("policy_id", policy_id);

    if (error) {
      console.error("Vote fetch error:", error);
      return res.status(500).json({ error: "Failed to fetch votes" });
    }

    const votes = data || [];
    const counts = {
      trust: votes.filter((v) => v.vote === "trust").length,
      doubt: votes.filter((v) => v.vote === "doubt").length,
      distrust: votes.filter((v) => v.vote === "distrust").length,
      total: votes.length,
    };

    return res.status(200).json(counts);
  }

  return res.status(405).json({ error: "Method not allowed" });
}