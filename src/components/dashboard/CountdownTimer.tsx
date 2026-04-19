import { getDaysRemaining, getCountdownColor } from "@/lib/countdown";

interface CountdownTimerProps {
  targetDate: Date | string | null;
  policyName: string;
  showLabel?: boolean;
}

export function CountdownTimer({ targetDate, policyName, showLabel = true }: CountdownTimerProps) {
  const daysRemaining = getDaysRemaining(targetDate);
  const color = getCountdownColor(daysRemaining);
  
  if (daysRemaining === null) {
    return null;
  }
  
  const isPast = daysRemaining < 0;
  const colorClasses = {
    green: "text-success",
    yellow: "text-accent",
    red: "text-destructive"
  };
  
  return (
    <div className="flex items-center gap-2">
      {isPast ? (
        <span className="inline-flex items-center px-3 py-1 bg-destructive/10 text-destructive text-sm font-semibold rounded-full">
          ล่าช้า {Math.abs(daysRemaining)} วัน
        </span>
      ) : (
        <>
          {showLabel && <span className="text-sm text-muted-foreground">เหลือ</span>}
          <span className={`text-lg font-bold ${colorClasses[color]}`}>
            {daysRemaining}
          </span>
          {showLabel && <span className="text-sm text-muted-foreground">วัน</span>}
        </>
      )}
    </div>
  );
}