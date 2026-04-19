import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell, AlertCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PendingCounts {
  updates: number;
  tips: number;
  total: number;
}

export function PendingNotifications() {
  const [counts, setCounts] = useState<PendingCounts>({ updates: 0, tips: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Count pending progress updates
        const { count: updatesCount } = await supabase
          .from("progress_updates")
          .select("*", { count: "exact", head: true })
          .eq("publish_status", "pending");

        // Count pending community tips
        const { count: tipsCount } = await supabase
          .from("community_tips")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        const updates = updatesCount || 0;
        const tips = tipsCount || 0;

        setCounts({
          updates,
          tips,
          total: updates + tips,
        });
      } catch (error) {
        console.error("Error fetching pending counts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();

    // Subscribe to real-time changes
    const updatesChannel = supabase
      .channel("pending-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "progress_updates" },
        () => fetchCounts()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_tips" },
        () => fetchCounts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(updatesChannel);
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            แจ้งเตือน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (counts.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            แจ้งเตือน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            ไม่มีรายการรอดำเนินการ
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          แจ้งเตือน
          <Badge variant="destructive" className="ml-auto">
            {counts.total}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {counts.updates > 0 && (
          <Link
            href="/admin/updates"
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium">อัปเดตความคืบหน้า</div>
                <div className="text-sm text-muted-foreground">
                  รอการอนุมัติ
                </div>
              </div>
            </div>
            <Badge variant="secondary">{counts.updates}</Badge>
          </Link>
        )}

        {counts.tips > 0 && (
          <Link
            href="/admin/tips"
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium">เบาะแสจากประชาชน</div>
                <div className="text-sm text-muted-foreground">
                  รอการตรวจสอบ
                </div>
              </div>
            </div>
            <Badge variant="secondary">{counts.tips}</Badge>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}