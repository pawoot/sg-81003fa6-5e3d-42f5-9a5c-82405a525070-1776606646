import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/policyService";
import type { DashboardStats } from "@/lib/types";

export function HeroStats() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    in_progress: 0,
    completed: 0,
    delayed_or_planned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) =>
        <div key={i} className="bg-card border border-border rounded-lg p-6 text-center animate-pulse">
            <div className="h-10 w-16 bg-muted rounded mx-auto mb-2"></div>
            <div className="h-5 w-24 bg-muted rounded mx-auto"></div>
          </div>
        )}
      </div>);

  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
        <div className="text-4xl font-bold text-primary mb-2" style={{ color: "#f97316", fontSize: "56px" }}>{stats.total}</div>
        <div className="text-muted-foreground font-medium">นโยบายทั้งหมด</div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
        <div className="text-4xl font-bold text-accent mb-2" style={{ fontSize: "56px" }}>{stats.in_progress}</div>
        <div className="text-muted-foreground font-medium">กำลังดำเนินการ</div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
        <div className="text-4xl font-bold text-success mb-2" style={{ color: "#bababa", fontSize: "56px" }}>{stats.completed}</div>
        <div className="text-muted-foreground font-medium">เสร็จสิ้น</div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
        <div className="text-4xl font-bold text-destructive mb-2" style={{ fontSize: "56px", color: "#f97316" }}>{stats.delayed_or_planned}</div>
        <div className="text-muted-foreground font-medium">ยังไม่เริ่ม/ล่าช้า</div>
      </div>
    </div>);

}