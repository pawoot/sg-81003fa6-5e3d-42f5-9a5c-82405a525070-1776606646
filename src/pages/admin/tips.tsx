import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MessageSquare, MapPin, Link as LinkIcon, CheckCircle, X, Eye } from "lucide-react";

interface Tip {
  id: number;
  policy_id: string;
  description: string;
  evidence_url: string | null;
  location_province: string | null;
  location_district: string | null;
  status: "new" | "under_review" | "verified_published" | "rejected";
  reviewer_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  policies: {
    id: string;
    policy_number: string;
    title: string;
    slug: string;
  };
}

const STATUS_CONFIG = {
  new: { label: "ใหม่", color: "bg-blue-100 text-blue-800" },
  under_review: { label: "กำลังตรวจสอบ", color: "bg-yellow-100 text-yellow-800" },
  verified_published: { label: "ตรวจสอบแล้ว", color: "bg-green-100 text-green-800" },
  rejected: { label: "ปฏิเสธ", color: "bg-red-100 text-red-800" },
};

export default function AdminTipsPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"new" | "under_review" | "all">("new");
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    try {
      const response = await fetch("/api/admin/tips");
      if (!response.ok) throw new Error("Failed to fetch tips");
      const data = await response.json();
      setTips(data);
    } catch (error) {
      console.error("Error loading tips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: "approve" | "reject") => {
    const tip = tips.find(t => t.id === id);
    if (!tip) return;

    const confirmMessage = action === "approve"
      ? `อนุมัติเบาะแสนี้และเผยแพร่ใน Activity Log ของนโยบาย "${tip.policies.title}"?`
      : `ปฏิเสธเบาะแสนี้? เบาะแสจะไม่ถูกเผยแพร่`;

    if (!confirm(confirmMessage)) return;

    setProcessingId(id);
    try {
      const response = await fetch("/api/admin/tips", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      if (!response.ok) throw new Error("Failed to update tip");

      // Reload tips
      await loadTips();
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredTips = tips.filter(tip => {
    if (activeTab === "new") return tip.status === "new";
    if (activeTab === "under_review") return tip.status === "under_review";
    return true;
  });

  const pendingCount = tips.filter(t => t.status === "new" || t.status === "under_review").length;

  return (
    <AdminLayout>
      <SEO title="เบาะแสประชาชน | Admin" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-3xl">เบาะแสจากประชาชน</h1>
          <p className="text-muted-foreground mt-1">
            รีวิวและอนุมัติเบาะแสที่ประชาชนส่งเข้ามา
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-destructive text-white px-4 py-2 rounded-full font-semibold">
            {pendingCount} รอตรวจสอบ
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab("new")}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            activeTab === "new"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          ใหม่ ({tips.filter(t => t.status === "new").length})
        </button>
        <button
          onClick={() => setActiveTab("under_review")}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            activeTab === "under_review"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          กำลังตรวจสอบ ({tips.filter(t => t.status === "under_review").length})
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            activeTab === "all"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          ทั้งหมด ({tips.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">กำลังโหลด...</div>
      ) : filteredTips.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {activeTab === "new" && "ไม่มีเบาะแสใหม่"}
            {activeTab === "under_review" && "ไม่มีเบาะแสที่กำลังตรวจสอบ"}
            {activeTab === "all" && "ยังไม่มีเบาะแสในระบบ"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTips.map((tip) => {
            const statusConfig = STATUS_CONFIG[tip.status];
            const isProcessing = processingId === tip.id;
            const canAction = ["new", "under_review"].includes(tip.status);

            return (
              <div key={tip.id} className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(tip.created_at).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="text-sm text-muted-foreground">นโยบาย:</span>
                      <a
                        href={`/policies/${tip.policies.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 font-semibold text-primary hover:underline"
                      >
                        {tip.policies.policy_number} - {tip.policies.title}
                      </a>
                    </div>

                    <p className="text-foreground mb-4 whitespace-pre-wrap bg-muted/30 rounded-lg p-4">
                      {tip.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      {tip.evidence_url && (
                        <div className="flex items-center gap-2">
                          <LinkIcon className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={tip.evidence_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            ดูหลักฐาน →
                          </a>
                        </div>
                      )}
                      {(tip.location_province || tip.location_district) && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {[tip.location_district, tip.location_province].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>

                    {tip.reviewer_notes && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                        <p className="text-sm font-semibold mb-1">หมายเหตุจากผู้ตรวจสอบ:</p>
                        <p className="text-sm text-muted-foreground">{tip.reviewer_notes}</p>
                      </div>
                    )}
                  </div>

                  {canAction && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(tip.id, "approve")}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors font-semibold disabled:opacity-50"
                        title="อนุมัติเผยแพร่"
                      >
                        <CheckCircle className="w-5 h-5" />
                        อนุมัติ
                      </button>
                      <button
                        onClick={() => handleAction(tip.id, "reject")}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors font-semibold disabled:opacity-50"
                        title="ปฏิเสธ"
                      >
                        <X className="w-5 h-5" />
                        ปฏิเสธ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredTips.length > 0 && (
        <p className="text-sm text-muted-foreground text-center mt-6">
          แสดง {filteredTips.length} จาก {tips.length} เบาะแส
        </p>
      )}
    </AdminLayout>
  );
}