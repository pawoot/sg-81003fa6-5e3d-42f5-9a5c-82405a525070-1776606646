import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");
const SITE_URL = Deno.env.get("SITE_URL") || "https://your-site.vercel.app";

interface NotificationPayload {
  type: "progress_update" | "community_tip";
  id: string;
  policy_id?: string;
  policy_title?: string;
  description?: string;
  submitted_by?: string;
}

serve(async (req) => {
  try {
    const payload: NotificationPayload = await req.json();

    if (!RESEND_API_KEY || !ADMIN_EMAIL) {
      return new Response(
        JSON.stringify({ error: "Missing email configuration" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    let subject = "";
    let htmlContent = "";
    let adminUrl = "";

    if (payload.type === "progress_update") {
      subject = `🔔 อัปเดตความคืบหน้าใหม่: ${payload.policy_title || "นโยบาย"}`;
      adminUrl = `${SITE_URL}/admin/updates`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Noto Sans Thai', Arial, sans-serif; line-height: 1.6; color: #1e293b; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4f46e5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; }
              .footer { padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
              .button { display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px; }
              .info { background: white; padding: 16px; border-left: 4px solid #4f46e5; margin: 16px 0; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">PolicyWatch Thailand</h1>
                <p style="margin: 8px 0 0 0;">ระบบติดตามนโยบายรัฐบาล</p>
              </div>
              <div class="content">
                <h2>มีอัปเดตความคืบหน้าใหม่รอการอนุมัติ</h2>
                
                <div class="info">
                  <strong>นโยบาย:</strong> ${payload.policy_title || "-"}<br>
                  <strong>รายละเอียด:</strong> ${payload.description || "-"}
                </div>

                <p>กรุณาเข้าสู่ระบบ Admin Panel เพื่อตรวจสอบและอนุมัติ</p>

                <a href="${adminUrl}" class="button">ไปหน้ารีวิวอัปเดต</a>
              </div>
              <div class="footer">
                <p>อีเมลนี้ส่งอัตโนมัติจาก PolicyWatch Thailand Admin System</p>
              </div>
            </div>
          </body>
        </html>
      `;
    } else if (payload.type === "community_tip") {
      subject = `💡 เบาะแสจากประชาชนใหม่`;
      adminUrl = `${SITE_URL}/admin/tips`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Noto Sans Thai', Arial, sans-serif; line-height: 1.6; color: #1e293b; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0ea5e9; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; }
              .footer { padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
              .button { display: inline-block; padding: 12px 24px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px; }
              .info { background: white; padding: 16px; border-left: 4px solid #0ea5e9; margin: 16px 0; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">PolicyWatch Thailand</h1>
                <p style="margin: 8px 0 0 0;">ระบบติดตามนโยบายรัฐบาล</p>
              </div>
              <div class="content">
                <h2>มีเบาะแสจากประชาชนใหม่รอการตรวจสอบ</h2>
                
                <div class="info">
                  <strong>ส่งโดย:</strong> ${payload.submitted_by || "ไม่ระบุชื่อ"}<br>
                  <strong>เนื้อหา:</strong> ${payload.description?.substring(0, 200) || "-"}${(payload.description?.length || 0) > 200 ? "..." : ""}
                </div>

                <p>กรุณาเข้าสู่ระบบ Admin Panel เพื่อตรวจสอบและตัดสินใจ</p>

                <a href="${adminUrl}" class="button">ไปหน้ารีวิวเบาะแส</a>
              </div>
              <div class="footer">
                <p>อีเมลนี้ส่งอัตโนมัติจาก PolicyWatch Thailand Admin System</p>
              </div>
            </div>
          </body>
        </html>
      `;
    }

    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PolicyWatch Thailand <noreply@policywatch.app>",
        to: [ADMIN_EMAIL],
        subject: subject,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: error }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-notification-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});