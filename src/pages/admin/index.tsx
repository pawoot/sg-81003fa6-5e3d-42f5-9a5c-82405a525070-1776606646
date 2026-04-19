import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getDashboardStats } from "@/services/policyService";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    in_progress: 0,
    completed: 0,
    delayed_or_planned: 0,
  });
  const [pendingUpdates, setPendingUpdates] = useState(0);
  const [pendingTips, setPendingTips] = useState(0);

  useEffect(() => {
    async function loadData() {
      // Policy stats
      const policyStats = await getDashboardStats();
      setStats(policyStats);

      // Pending updates count
      const { count: updatesCount } = await supabase
        .from("progress_updates")
        .select("*", { count: "exact", head: true })
        .eq("publish_status", "under_review");
      setPendingUpdates(updatesCount || 0);

      // Pending tips count
      const { count: tipsCount } = await supabase
        .from("community_tips")
        .select("*", { count: "exact", head: true })
        .eq("status", "new");
      setPendingTips(tipsCount || 0);
    }

    loadData();
  }, []);

  const statCards = [
    {
      label: "นโยบายทั้งหมด",
      value: stats.total,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      label: "กำลังดำเนินการ",
      value: stats.in_progress,
      icon: TrendingUp,
      color: "bg-yellow-500",
    },
    {
      label: "เสร็จสิ้น",
      value: stats.completed,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      label: "ยังไม่เริ่ม/ล่าช้า",
      value: stats.delayed_or_planned,
      icon: Clock,
      color: "bg-orange-500",
    },
  ];

  const actionCards = [
    {
      label: "อัปเดตรอตรวจสอบ",
      value: stats.pending_updates,
      color: "bg-amber-600",
      icon: TrendingUp,
      href: "/admin/updates",
    },
    {
      label: "เบาะแสรอรีวิว",
      value: stats.pending_tips,
      color: "bg-blue-600",
      icon: MessageSquare,
      href: "/admin/tips",
    },
  ];

  return (
    <AdminLayout>
      <SEO 
        title="Admin Dashboard | PolicyWatch Thailand"
        description="แดชบอร์ดผู้ดูแลระบบ PolicyWatch Thailand"
      />

      <div>
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">Dashboard</h1>
          <p className="text-muted-foreground">ภาพรวมระบบติดตามนโยบาย</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card rounded-xl p-6 border border-border shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Action Items */}
        <div className="mb-8">
          <h2 className="font-heading font-semibold text-xl mb-4">รายการที่ต้องดำเนินการ</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {actionCards.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${item.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {item.value > 0 && (
                      <span className="bg-destructive text-white text-sm font-bold px-3 py-1 rounded-full">
                        {item.value}
                      </span>
                    )}
                  </div>
                  <p className="text-foreground font-semibold group-hover:text-primary transition-colors">
                    {item.label}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.value === 0 ? "ไม่มีรายการใหม่" : `${item.value} รายการรอตรวจสอบ`}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-heading font-semibold text-xl mb-4">เครื่องมือ</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/admin/policies/new"
              className="bg-primary text-white rounded-lg p-4 hover:bg-primary/90 transition-colors text-center font-semibold"
            >
              + เพิ่มนโยบายใหม่
            </Link>
            <Link
              href="/admin/policies"
              className="bg-card border border-border rounded-lg p-4 hover:bg-muted transition-colors text-center font-semibold"
            >
              จัดการนโยบาย
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border rounded-lg p-4 hover:bg-muted transition-colors text-center font-semibold"
            >
              ดูหน้าเว็บไซต์ →
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}