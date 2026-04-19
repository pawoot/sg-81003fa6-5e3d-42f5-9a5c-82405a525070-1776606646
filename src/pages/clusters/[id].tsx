import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { PolicyCard } from "@/components/policy/PolicyCard";
import { getClusterById, getClusterStats } from "@/services/clusterService";
import { getPoliciesByCluster } from "@/services/policyService";
import type { Cluster, PolicyWithDetails } from "@/lib/types";
import { ArrowLeft, TrendingUp, Target, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ClusterDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [policies, setPolicies] = useState<PolicyWithDetails[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    planned: 0,
    in_progress: 0,
    completed: 0,
    delayed: 0,
    cancelled: 0,
    avg_progress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"number" | "deadline" | "progress">("number");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      
      setLoading(true);
      const clusterId = parseInt(id as string);
      
      const [clusterData, policiesData, statsData] = await Promise.all([
        getClusterById(clusterId),
        getPoliciesByCluster(clusterId),
        getClusterStats(clusterId),
      ]);

      setCluster(clusterData);
      setPolicies(policiesData);
      setStats(statsData);
      setLoading(false);
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <>
        <SEO title="กำลังโหลด..." />
        <Navbar />
        <main className="min-h-screen bg-background py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">กำลังโหลดข้อมูล...</div>
          </div>
        </main>
      </>
    );
  }

  if (!cluster) {
    return (
      <>
        <SEO title="ไม่พบกลุ่มยุทธศาสตร์" />
        <Navbar />
        <main className="min-h-screen bg-background py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-bold text-4xl mb-4">ไม่พบกลุ่มยุทธศาสตร์</h1>
            <Link href="/" className="text-primary hover:underline">
              กลับไปหน้าแรก
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Sort policies
  let sortedPolicies = [...policies];
  if (sortBy === "deadline") {
    sortedPolicies.sort((a, b) => {
      if (!a.target_date) return 1;
      if (!b.target_date) return -1;
      return new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
    });
  } else if (sortBy === "progress") {
    sortedPolicies.sort((a, b) => (b.progress_percent || 0) - (a.progress_percent || 0));
  } else {
    sortedPolicies.sort((a, b) => a.policy_number.localeCompare(b.policy_number));
  }

  // Filter by status
  if (filterStatus !== "all") {
    sortedPolicies = sortedPolicies.filter(p => p.status === filterStatus);
  }

  return (
    <>
      <SEO 
        title={`${cluster.short_name} | PolicyWatch Thailand`}
        description={`นโยบาย${cluster.short_name} — ${cluster.name}`}
      />
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div 
          className="py-16 px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: `${cluster.color_hex}15` }}
        >
          <div className="max-w-7xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับไปหน้าแรก
            </Link>

            <div className="flex items-start gap-4">
              <div 
                className="text-5xl p-4 rounded-2xl"
                style={{ backgroundColor: `${cluster.color_hex}20` }}
              >
                {cluster.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  กลุ่มยุทธศาสตร์ที่ {id}
                </div>
                <h1 className="font-heading font-bold text-4xl mb-4">
                  {cluster.name}
                </h1>
                {cluster.description && (
                  <p className="text-lg text-muted-foreground max-w-3xl">
                    {cluster.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">นโยบายทั้งหมด</span>
              </div>
              <div className="text-3xl font-bold">{stats.total}</div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-muted-foreground">กำลังดำเนินการ</span>
              </div>
              <div className="text-3xl font-bold text-yellow-600">{stats.in_progress}</div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-muted-foreground">เสร็จสิ้น</span>
              </div>
              <div className="text-3xl font-bold text-emerald-600">{stats.completed}</div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">ความคืบหน้าเฉลี่ย</span>
              </div>
              <div className="text-3xl font-bold">{stats.avg_progress}%</div>
            </div>
          </div>
        </div>

        {/* Policies Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                กรองตามสถานะ
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">ทั้งหมด ({policies.length})</option>
                <option value="planned">วางแผน ({stats.planned})</option>
                <option value="in_progress">กำลังดำเนินการ ({stats.in_progress})</option>
                <option value="completed">เสร็จสิ้น ({stats.completed})</option>
                <option value="delayed">ล่าช้า ({stats.delayed})</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                เรียงตาม
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "number" | "deadline" | "progress")}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="number">เลขที่นโยบาย</option>
                <option value="deadline">กำหนดเสร็จ (เร็วสุดก่อน)</option>
                <option value="progress">ความคืบหน้า (มากสุดก่อน)</option>
              </select>
            </div>
          </div>

          {/* Policies Grid */}
          {sortedPolicies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              ไม่พบนโยบายในกลุ่มนี้
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPolicies.map((policy) => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}