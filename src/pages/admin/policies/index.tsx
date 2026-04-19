import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAllPolicies } from "@/services/policyService";
import type { PolicyWithDetails } from "@/lib/types";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<PolicyWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadPolicies() {
      const data = await getAllPolicies();
      setPolicies(data);
    }
    loadPolicies();
  }, []);

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.policy_number.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || policy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const STATUS_LABELS: Record<string, string> = {
    planned: "วางแผน",
    in_progress: "กำลังดำเนินการ",
    delayed: "ล่าช้า",
    completed: "เสร็จสิ้น",
    cancelled: "ยกเลิก",
  };

  return (
    <AdminLayout>
      <SEO 
        title="จัดการนโยบาย | Admin | PolicyWatch Thailand"
        description="จัดการนโยบายทั้งหมดในระบบ"
      />

      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl mb-2">จัดการนโยบาย</h1>
            <p className="text-muted-foreground">แก้ไข สร้าง หรือลบนโยบาย</p>
          </div>
          <Link
            href="/admin/policies/new"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            เพิ่มนโยบายใหม่
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-6 border border-border mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">ค้นหา</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ชื่อนโยบาย หรือ หมายเลข..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">สถานะ</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">ทั้งหมด</option>
                <option value="planned">วางแผน</option>
                <option value="in_progress">กำลังดำเนินการ</option>
                <option value="delayed">ล่าช้า</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>
          </div>
        </div>

        {/* Policies Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">หมายเลข</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ชื่อนโยบาย</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">สถานะ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ความก้าวหน้า</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPolicies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      ไม่พบนโยบาย
                    </td>
                  </tr>
                ) : (
                  filteredPolicies.map((policy) => (
                    <tr key={policy.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold">{policy.policy_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="font-semibold line-clamp-2">{policy.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-muted">
                          {STATUS_LABELS[policy.status] || policy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary h-full transition-all"
                              style={{ width: `${policy.progress_percent}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold w-12 text-right">
                            {Math.round(Number(policy.progress_percent))}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/policies/${policy.id}/edit`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="แก้ไข"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                            title="ลบ"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPolicies.length > 0 && (
          <p className="text-sm text-muted-foreground mt-4">
            แสดง {filteredPolicies.length} จาก {policies.length} นโยบาย
          </p>
        )}
      </div>
    </AdminLayout>
  );
}