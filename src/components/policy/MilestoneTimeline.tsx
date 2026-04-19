import { toThaiDate } from "@/lib/countdown";
import type { Milestone } from "@/lib/types";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

const STATUS_CONFIG = {
  pending: { 
    label: "รอดำเนินการ", 
    icon: Circle,
    color: "text-muted-foreground",
    bgColor: "bg-muted"
  },
  in_progress: { 
    label: "กำลังดำเนินการ", 
    icon: Clock,
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  completed: { 
    label: "เสร็จสิ้น", 
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10"
  },
  skipped: { 
    label: "ข้าม", 
    icon: Circle,
    color: "text-muted-foreground",
    bgColor: "bg-muted"
  },
};

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  const sortedMilestones = [...milestones].sort((a, b) => a.milestone_order - b.milestone_order);

  return (
    <div className="space-y-4">
      {sortedMilestones.map((milestone, index) => {
        const config = STATUS_CONFIG[milestone.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
        const Icon = config.icon;
        const isLast = index === sortedMilestones.length - 1;

        return (
          <div key={milestone.id} className="flex gap-4">
            {/* Icon Column */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              {!isLast && (
                <div className="w-0.5 h-full bg-border mt-2"></div>
              )}
            </div>

            {/* Content Column */}
            <div className="flex-1 pb-8">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-foreground">{milestone.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${config.bgColor} ${config.color}`}>
                  {config.label}
                </span>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                {milestone.weight_percent && (
                  <div>น้ำหนัก: {milestone.weight_percent}%</div>
                )}
                {milestone.target_date && (
                  <div>เป้าหมาย: {toThaiDate(milestone.target_date)}</div>
                )}
                {milestone.completed_date && (
                  <div className="text-success">เสร็จสิ้น: {toThaiDate(milestone.completed_date)}</div>
                )}
                {milestone.notes && (
                  <div className="mt-2 text-foreground">{milestone.notes}</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}