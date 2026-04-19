import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  ExternalLink,
  AlertCircle,
  Filter
} from "lucide-react";
import { toThaiDate } from "@/lib/countdown";
import Link from "next/link";

interface ProgressUpdate {
  id: string;
  policy_id: string;
  update_type: string;
  description: string;
  old_status: string | null;
  new_status: string | null;
  evidence_urls: any[];
  data_source_type: string | null;
  publish_status: string;
  created_at: string;
  policies: {
    id: string;
    title: string;
    policy_number: string;
    slug: string;
  };
}

const UPDATE_TYPE_LABELS: Record<string, string> = {
  status_change: "เปลี่ยนสถานะ",
  budget_update: "อัปเดตงบประมาณ",
  evidence_added: "เพิ่มหลักฐาน",
  news_mentioned: "ข่าวรายงาน",
  community_tip: "เบาะแสประชาชน",
  law_passed: "กฎหมายผ่าน",
  cabinet_approved: "ครม.อนุมัติ",
};

const DATA_SOURCE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  api: { label: "API", icon: "🟢", color: "text-success" },
  csv: { label: "CSV", icon: "🟢", color: "text-success" },
  html: { label: "HTML", icon: "🟡", color: "text-amber-600" },
  pdf: { label: "PDF", icon: "🔴", color: "text-destructive" },
  manual: { label: "Manual", icon: "⚪", color: "text-muted-foreground" },
};

export default function UpdatesReviewPage() {
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadUpdates();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [updates, filterType, filterStatus]);

  async function loadUpdates() {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      setLoading(false);
      return;
    }

    const token = session.session.access_token;
    const response = await fetch("/api/admin/updates", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUpdates(data);
    }
    setLoading(false);
  }

  function applyFilters() {
    let filtered = [...updates];

    if (filterType !== "all") {
      filtered = filtered.filter((u) => u.update_type === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((u) => u.publish_status === filterStatus);
    }

    setFilteredUpdates(filtered);
  }

  async function handleAction(updateId: string, action: "approve" | "reject") {
    setProcessing(updateId);
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      alert("Session expired. Please login again.");
      setProcessing(null);
      return;
    }

    const token = session.session.access_token;
    const response = await fetch("/api/admin/updates", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        update_id: updateId,
        action,
      }),
    });

    if (response.ok) {
      // Reload updates
      await loadUpdates();
    } else {
      alert("Failed to process update");
    }
    setProcessing(null);
  }

  const uniqueTypes = Array.from(new Set(updates.map((u) => u.update_type)));

  return (
    <AdminLayout>
      <SEO
        title="รีวิวอัปเดต | Admin - PolicyWatch Thailand"
        description="อนุมัติ progress updates สำหรับนโยบาย"
      />

      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">รีวิวอัปเดต</h1>
          <p className="text-muted-foreground">
            อนุมัติหรือปฏิเสธ progress updates ก่อนเผยแพร่
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-sm text-muted-foreground">รอตรวจสอบ</span>
            </div>
            <p className="text-3xl font-bold">
              {updates.filter((u) => u.publish_status === "draft").length}
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm text-muted-foreground">กำลังรีวิว</span>
            </div>
            <p className="text-3xl font-bold">
              {updates.filter((u) => u.publish_status === "under_review").length}
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-sm text-muted-foreground">ทั้งหมด</span>
            </div>
            <p className="text-3xl font-bold">{updates.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold">กรองข้อมูล</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">ประเภทอัปเดต</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              >
                <option value="all">ทั้งหมด</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {UPDATE_TYPE_LABELS[type] || type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">สถานะ</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              >
                <option value="all">ทั้งหมด</option>
                <option value="draft">Draft</option>
                <option value="under_review">Under Review</option>
              </select>
            </div>
          </div>
        </div>

        {/* Updates List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">กำลังโหลด...</p>
          </div>
        ) : filteredUpdates.length === 0 ? (
          <div className="bg-muted/50 rounded-lg p-12 text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">ไม่มีอัปเดตรอตรวจสอบ</p>
            <p className="text-muted-foreground">อัปเดตทั้งหมดได้รับการอนุมัติแล้ว</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUpdates.map((update) => {
              const sourceConfig = update.data_source_type 
                ? DATA_SOURCE_CONFIG[update.data_source_type]
                : null;

              return (
                <div
                  key={update.id}
                  className="bg-card rounded-lg p-6 border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                          {UPDATE_TYPE_LABELS[update.update_type] || update.update_type}
                        </span>
                        {update.publish_status === "draft" && (
                          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                            รอตรวจสอบ
                          </span>
                        )}
                        {update.publish_status === "under_review" && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                            กำลังรีวิว
                          </span>
                        )}
                        {sourceConfig && (
                          <span className={`text-xs font-medium ${sourceConfig.color}`}>
                            {sourceConfig.icon} {sourceConfig.label}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/policies/${update.policies.slug}`}
                        target="_blank"
                        className="font-semibold text-lg hover:text-primary transition-colors inline-flex items-center gap-2"
                      >
                        นโยบาย {update.policies.policy_number}: {update.policies.title}
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <p className="text-muted-foreground mt-2">{update.description}</p>

                      {update.old_status && update.new_status && (
                        <p className="text-sm text-muted-foreground mt-2">
                          เปลี่ยนจาก{" "}
                          <span className="font-semibold">{update.old_status}</span> →{" "}
                          <span className="font-semibold">{update.new_status}</span>
                        </p>
                      )}

                      {Array.isArray(update.evidence_urls) && update.evidence_urls.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">หลักฐาน:</p>
                          <div className="space-y-1">
                            {update.evidence_urls.map((evidence: any, idx: number) => (
                              <a
                                key={idx}
                                href={evidence.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-2"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {evidence.title || evidence.url}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground mt-4">
                        สร้างเมื่อ: {toThaiDate(new Date(update.created_at))}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleAction(update.id, "approve")}
                        disabled={processing === update.id}
                        className="bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold"
                      >
                        <CheckCircle className="w-4 h-4" />
                        อนุมัติ
                      </button>
                      <button
                        onClick={() => handleAction(update.id, "reject")}
                        disabled={processing === update.id}
                        className="bg-destructive text-white px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold"
                      >
                        <XCircle className="w-4 h-4" />
                        ปฏิเสธ
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <p className="text-sm text-muted-foreground text-center pt-4">
              แสดง {filteredUpdates.length} จาก {updates.length} อัปเดต
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}