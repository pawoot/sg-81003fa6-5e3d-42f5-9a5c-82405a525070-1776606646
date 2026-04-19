import { useEffect, useState } from "react";
import { getFeaturedPolicies } from "@/services/policyService";
import { CountdownTimer } from "./CountdownTimer";
import { toThaiDate } from "@/lib/countdown";
import type { PolicyWithCluster } from "@/lib/types";

export function FeaturedPolicies() {
  const [policies, setPolicies] = useState<PolicyWithCluster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPolicies() {
      const data = await getFeaturedPolicies();
      setPolicies(data);
      setLoading(false);
    }
    loadPolicies();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-6 w-20 bg-muted rounded mb-3"></div>
            <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
            <div className="h-16 w-full bg-muted rounded mb-4"></div>
            <div className="h-5 w-40 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {policies.map(policy => (
        <div
          key={policy.id}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
              policy.priority === "urgent" 
                ? "bg-destructive/10 text-destructive" 
                : "bg-accent/10 text-accent"
            }`}>
              {policy.priority === "urgent" ? "ด่วนที่สุด" : "สำคัญมาก"}
            </span>
            {policy.target_date && (
              <CountdownTimer
                targetDate={policy.target_date}
                policyName={policy.title}
                showLabel={false}
              />
            )}
          </div>
          
          <h3 className="font-heading font-bold text-xl mb-2 line-clamp-2">
            {policy.title}
          </h3>
          
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {policy.description}
          </p>
          
          <div className="flex items-center justify-between">
            {policy.target_date ? (
              <span className="text-sm font-medium text-foreground">
                📅 เป้าหมาย: {toThaiDate(policy.target_date)}
              </span>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                📅 ดำเนินการต่อเนื่อง
              </span>
            )}
            <a 
              href={`/policies/${policy.slug}`} 
              className="text-primary hover:underline font-medium"
            >
              ดูรายละเอียด →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}