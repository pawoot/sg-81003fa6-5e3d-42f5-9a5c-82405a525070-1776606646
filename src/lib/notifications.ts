import { supabase } from "@/integrations/supabase/client";

interface NotificationPayload {
  type: "progress_update" | "community_tip";
  policy_title?: string;
  description?: string;
  submitter_name?: string;
  admin_url: string;
}

/**
 * Send email notification to admin via Edge Function
 */
export async function sendAdminNotification(payload: NotificationPayload): Promise<void> {
  try {
    const { data, error } = await supabase.functions.invoke("send-notification-email", {
      body: payload,
    });

    if (error) {
      console.error("Failed to send notification email:", error);
      // Don't throw - email failures shouldn't block the main operation
      return;
    }

    console.log("Notification email sent successfully:", data);
  } catch (error) {
    console.error("Error invoking notification function:", error);
    // Silently fail - email is optional
  }
}