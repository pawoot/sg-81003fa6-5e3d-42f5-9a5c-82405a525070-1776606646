import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const query = req.query.q;
  const searchQuery = Array.isArray(query) ? query[0] : query;

  if (!searchQuery || searchQuery.trim().length < 2) {
    return res.status(200).json([]);
  }

  const { data, error } = await supabase
    .from("policies")
    .select(`
      id,
      policy_number,
      title,
      description,
      slug,
      status,
      priority,
      clusters (
        id,
        short_name,
        color_hex,
        icon
      )
    `)
    .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,policy_number.ilike.%${searchQuery}%`)
    .limit(10);

  if (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Search failed" });
  }

  return res.status(200).json(data || []);
}