import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { getAllPolicies } from "@/services/policyService";
import { getAllClusters } from "@/services/clusterService";
import { PolicyCard } from "@/components/policy/PolicyCard";
import type { PolicyWithCluster, Cluster } from "@/lib/types";
import { Search, Filter } from "lucide-react";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<PolicyWithCluster[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [policiesData, clustersData] = await Promise.all([
        getAllPolicies(),
        getAllClusters()
      ]);
      setPolicies(policiesData);
      setClusters(clustersData);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = searchQuery === "" || 
      policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCluster = selectedCluster === null || policy.cluster_id === selectedCluster;
    const matchesStatus = selectedStatus === null || policy.status === selectedStatus;
    const matchesPriority = selectedPriority === null || policy.priority === selectedPriority;

    return matchesSearch && matchesCluster && matchesStatus && matchesPriority;
  });

  return (
    <>
      <SEO 
        title="นโยบายทั้งหมด | PolicyWatch Thailand"
        description="ติดตามนโยบาย 23 ข้อของรัฐบาลอนุทิน 2 แบบเรียลไทม์"
      />
      <Navbar />

      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">
              นโยบายทั้งหมด
            </h1>
            <p className="text-lg text-muted-foreground">
              ติดตามความคืบหน้า 23 นโยบายหลักของรัฐบาล
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ค้นหานโยบาย..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Cluster Filter */}
              <select
                value={selectedCluster || ""}
                onChange={(e) => setSelectedCluster(e.target.value ? Number(e.target.value) : null)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">ทุกกลุ่มยุทธศาสตร์</option>
                {clusters.map(cluster => (
                  <option key={cluster.id} value={cluster.id}>
                    {cluster.icon} {cluster.short_name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus || ""}
                onChange={(e) => setSelectedStatus(e.target.value || null)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">ทุกสถานะ</option>
                <option value="planned">วางแผน</option>
                <option value="in_progress">กำลังดำเนินการ</option>
                <option value="delayed">ล่าช้า</option>
                <option value="completed">เสร็จสิ้น</option>
              </select>

              {/* Priority Filter */}
              <select
                value={selectedPriority || ""}
                onChange={(e) => setSelectedPriority(e.target.value || null)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">ทุกระดับความสำคัญ</option>
                <option value="urgent">ด่วนที่สุด</option>
                <option value="high">สำคัญมาก</option>
                <option value="normal">ปกติ</option>
              </select>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>แสดง {filteredPolicies.length} จาก {policies.length} นโยบาย</span>
              {(selectedCluster || selectedStatus || selectedPriority || searchQuery) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCluster(null);
                    setSelectedStatus(null);
                    setSelectedPriority(null);
                  }}
                  className="text-primary hover:underline"
                >
                  ล้างตัวกรอง
                </button>
              )}
            </div>
          </div>

          {/* Policy Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                  <div className="h-6 w-20 bg-muted rounded mb-3"></div>
                  <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                  <div className="h-16 w-full bg-muted rounded mb-4"></div>
                  <div className="h-2 w-full bg-muted rounded mb-2"></div>
                  <div className="h-5 w-40 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredPolicies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">ไม่พบนโยบายที่ตรงกับเงื่อนไข</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPolicies.map(policy => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}