import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { getPolicyBySlug } from "@/services/policyService";
import { toThaiDate } from "@/lib/countdown";
import { CountdownTimer } from "@/components/dashboard/CountdownTimer";
import { Progress } from "@/components/ui/progress";
import { MilestoneTimeline } from "@/components/policy/MilestoneTimeline";
import { ActivityLog } from "@/components/policy/ActivityLog";
import { PublicVote } from "@/components/policy/PublicVote";
import type { PolicyDetail, KPI } from "@/lib/types";
import { ArrowLeft, Calendar, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG = {
  planned: { label: "วางแผน", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "กำลังดำเนินการ", color: "bg-yellow-100 text-yellow-800" },
  delayed: { label: "ล่าช้า", color: "bg-orange-100 text-orange-800" },
  completed: { label: "เสร็จสิ้น", color: "bg-green-100 text-green-800" },
  cancelled: { label: "ยกเลิก", color: "bg-gray-100 text-gray-600" },
};

export default function PolicyDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [policy, setPolicy] = useState<PolicyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPolicy() {
      if (!slug || typeof slug !== "string") return;
      
      const data = await getPolicyBySlug(slug);
      setPolicy(data);
      setLoading(false);
    }
    loadPolicy();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 w-32 bg-muted rounded mb-4"></div>
              <div className="h-12 w-3/4 bg-muted rounded mb-4"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!policy) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-bold text-4xl mb-4">ไม่พบนโยบาย</h1>
            <Link href="/policies" className="text-primary hover:underline">
              กลับไปหน้านโยบายทั้งหมด
            </Link>
          </div>
        </div>
      </>
    );
  }

  const statusConfig = STATUS_CONFIG[policy.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.planned;
  const kpis = (Array.isArray(policy.kpis) ? policy.kpis : []) as unknown as KPI[];

  return (
    <>
      <SEO 
        title={`${policy.title} | PolicyWatch Thailand`}
        description={policy.description || ""}
      />
      <Navbar />

      <main className="min-h-screen bg-background py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/policies"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้านโยบายทั้งหมด
          </Link>

          {/* Hero Section */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                {policy.clusters && (
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded border"
                    style={{ 
                      borderColor: policy.clusters.color_hex,
                      color: policy.clusters.color_hex 
                    }}
                  >
                    <span>{policy.clusters.icon}</span>
                    <span>{policy.clusters.short_name}</span>
                  </span>
                )}
              </div>
              {policy.target_date && (
                <CountdownTimer
                  targetDate={policy.target_date}
                  policyName={policy.title}
                />
              )}
            </div>

            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              {policy.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              {policy.description}
            </p>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">ความคืบหน้า</span>
                <span className="text-sm font-bold text-primary">
                  {policy.progress_percent?.toFixed(0) || 0}%
                </span>
              </div>
              <Progress value={Number(policy.progress_percent) || 0} className="h-3" />
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">วันที่เริ่มต้น</div>
                  <div className="text-muted-foreground">
                    {policy.start_date ? toThaiDate(policy.start_date) : "9 เมษายน 2569"}
                  </div>
                </div>
              </div>
              
              {policy.target_date && (
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  <div>
                    <div className="font-medium">เป้าหมาย</div>
                    <div className="text-muted-foreground">
                      {toThaiDate(policy.target_date)}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <div>
                  <div className="font-medium">ลำดับความสำคัญ</div>
                  <div className="text-muted-foreground">
                    {policy.priority === "urgent" ? "ด่วนที่สุด" : policy.priority === "high" ? "สำคัญมาก" : "ปกติ"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* KPIs Section */}
              {kpis.length > 0 && (
                <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                  <h2 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    ตัวชี้วัดความสำเร็จ (KPIs)
                  </h2>
                  <div className="space-y-4">
                    {kpis.map((kpi, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4">
                        <div className="font-medium text-foreground">{kpi.metric}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          เป้าหมาย: <span className="font-semibold text-foreground">{kpi.target}</span>
                          {kpi.unit && ` ${kpi.unit}`}
                          {kpi.current && (
                            <> • ปัจจุบัน: <span className="font-semibold text-primary">{kpi.current}</span></>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Milestones */}
              {policy.milestones && policy.milestones.length > 0 && (
                <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                  <h2 className="font-heading font-semibold text-xl mb-6">ไทม์ไลน์และขั้นตอน</h2>
                  <MilestoneTimeline milestones={policy.milestones} />
                </div>
              )}

              {/* Activity Log */}
              {policy.progress_updates && policy.progress_updates.length > 0 && (
                <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                  <h2 className="font-heading font-semibold text-xl mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    บันทึกความก้าวหน้า
                  </h2>
                  <ActivityLog updates={policy.progress_updates} />
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Public Vote Component */}
              <PublicVote policyId={policy.id} />

              {/* Info Box */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-heading font-semibold mb-4">ข้อมูลนโยบาย</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">หมายเลขนโยบาย</div>
                    <div className="font-semibold">{policy.policy_number}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">กลุ่มยุทธศาสตร์</div>
                    <div className="font-semibold">{policy.cluster?.name || "-"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">ความสำคัญ</div>
                    <div className="font-semibold capitalize">{PRIORITY_LABELS[policy.priority] || policy.priority}</div>
                  </div>
                  {policy.target_date && (
                    <div>
                      <div className="text-muted-foreground">กำหนดเสร็จ</div>
                      <div className="font-semibold">{toThaiDate(new Date(policy.target_date))}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}