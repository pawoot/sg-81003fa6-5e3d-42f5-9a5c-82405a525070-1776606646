import Link from "next/link";
import { CountdownTimer } from "@/components/dashboard/CountdownTimer";
import { toThaiDate } from "@/lib/countdown";
import type { PolicyWithCluster } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

interface PolicyCardProps {
  policy: PolicyWithCluster;
}

const STATUS_CONFIG = {
  planned: { label: "วางแผน", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "กำลังดำเนินการ", color: "bg-yellow-100 text-yellow-800" },
  delayed: { label: "ล่าช้า", color: "bg-orange-100 text-orange-800" },
  completed: { label: "เสร็จสิ้น", color: "bg-green-100 text-green-800" },
  cancelled: { label: "ยกเลิก", color: "bg-gray-100 text-gray-600" },
};

const PRIORITY_CONFIG = {
  urgent: { label: "ด่วนที่สุด", color: "bg-destructive/10 text-destructive" },
  high: { label: "สำคัญมาก", color: "bg-accent/10 text-accent" },
  normal: { label: "ปกติ", color: "bg-muted text-muted-foreground" },
};

export function PolicyCard({ policy }: PolicyCardProps) {
  const statusConfig = STATUS_CONFIG[policy.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.planned;
  const priorityConfig = PRIORITY_CONFIG[policy.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.normal;
  
  return (
    <Link href={`/policies/${policy.slug}`}>
      <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${priorityConfig.color}`}>
              {priorityConfig.label}
            </span>
          </div>
          {policy.target_date && (
            <CountdownTimer
              targetDate={policy.target_date}
              policyName={policy.title}
              showLabel={false}
            />
          )}
        </div>

        {/* Cluster Badge */}
        {policy.clusters && (
          <div className="mb-3">
            <span
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border"
              style={{ 
                borderColor: policy.clusters.color_hex,
                color: policy.clusters.color_hex 
              }}
            >
              <span>{policy.clusters.icon}</span>
              <span>{policy.clusters.short_name}</span>
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2 flex-grow">
          {policy.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {policy.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">ความคืบหน้า</span>
            <span className="text-xs font-semibold text-foreground">
              {policy.progress_percent?.toFixed(0) || 0}%
            </span>
          </div>
          <Progress value={Number(policy.progress_percent) || 0} className="h-2" />
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground">
          {policy.target_date ? (
            <>📅 เป้าหมาย: {toThaiDate(policy.target_date)}</>
          ) : (
            <>📅 ดำเนินการต่อเนื่อง</>
          )}
        </div>
      </div>
    </Link>
  );
}