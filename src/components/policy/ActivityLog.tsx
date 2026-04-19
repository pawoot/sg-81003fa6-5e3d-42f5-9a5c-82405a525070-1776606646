import { toThaiDate } from "@/lib/countdown";
import type { ProgressUpdate } from "@/lib/types";
import { FileText, AlertCircle, CheckCircle, Info, ExternalLink } from "lucide-react";

interface ActivityLogProps {
  updates: ProgressUpdate[];
}

const UPDATE_TYPE_CONFIG = {
  status_change: { 
    label: "เปลี่ยนสถานะ", 
    icon: AlertCircle,
    color: "text-blue-600"
  },
  budget_update: { 
    label: "อัปเดตงบประมาณ", 
    icon: FileText,
    color: "text-purple-600"
  },
  evidence_added: { 
    label: "เพิ่มหลักฐาน", 
    icon: ExternalLink,
    color: "text-green-600"
  },
  news_mentioned: { 
    label: "ข่าวเกี่ยวข้อง", 
    icon: Info,
    color: "text-orange-600"
  },
  law_passed: { 
    label: "กฎหมายผ่าน", 
    icon: CheckCircle,
    color: "text-emerald-600"
  },
  cabinet_approved: { 
    label: "ครม.อนุมัติ", 
    icon: CheckCircle,
    color: "text-teal-600"
  },
  community_tip: { 
    label: "เบาะแสจากประชาชน", 
    icon: Info,
    color: "text-amber-600"
  },
};

const DATA_SOURCE_CONFIG = {
  api: { label: "API", icon: "🟢", tooltip: "Machine Readable — ดีเยี่ยม" },
  csv: { label: "CSV", icon: "🟢", tooltip: "Machine Readable — ดีเยี่ยม" },
  html: { label: "HTML", icon: "🟡", tooltip: "อ่านได้แต่ไม่ Machine Readable" },
  pdf: { label: "PDF", icon: "🔴", tooltip: "PDF — อ่านยาก ไม่ Machine Readable" },
  manual: { label: "Manual", icon: "⚪", tooltip: "ป้อนข้อมูลโดยทีมงาน" },
};

export function ActivityLog({ updates }: ActivityLogProps) {
  const publishedUpdates = updates
    .filter(u => u.publish_status === "published")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (publishedUpdates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        ยังไม่มีการอัปเดตความคืบหน้า
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {publishedUpdates.map((update) => {
        const typeConfig = UPDATE_TYPE_CONFIG[update.update_type as keyof typeof UPDATE_TYPE_CONFIG];
        const sourceConfig = update.data_source_type 
          ? DATA_SOURCE_CONFIG[update.data_source_type as keyof typeof DATA_SOURCE_CONFIG]
          : null;
        const Icon = typeConfig?.icon || Info;

        return (
          <div key={update.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className={`mt-1 ${typeConfig?.color || "text-muted-foreground"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">
                    {typeConfig?.label || "อัปเดต"}
                  </span>
                  {sourceConfig && (
                    <span 
                      className="text-xs px-2 py-0.5 bg-muted rounded"
                      title={sourceConfig.tooltip}
                    >
                      {sourceConfig.icon} {sourceConfig.label}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {toThaiDate(update.created_at)}
                  </span>
                </div>
                <p className="text-sm text-foreground">
                  {update.description}
                </p>
                {Array.isArray(update.evidence_urls) && update.evidence_urls.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {update.evidence_urls.map((evidence: any, idx: number) => (
                      <a
                        key={idx}
                        href={evidence.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {evidence.title || evidence.url}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}