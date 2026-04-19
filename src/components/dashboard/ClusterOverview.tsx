import { useEffect, useState } from "react";
import { getClustersWithCount } from "@/services/clusterService";
import type { Cluster } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ClusterWithCount extends Cluster {
  policy_count: number;
}

export function ClusterOverview() {
  const [clusters, setClusters] = useState<ClusterWithCount[]>([]);

  useEffect(() => {
    async function loadClusters() {
      const data = await getClustersWithCount();
      setClusters(data);
    }
    loadClusters();
  }, []);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clusters.map((cluster) =>
      <Link
        key={cluster.id}
        href={`/clusters/${cluster.id}`}
        className="group bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-all hover:border-primary">
        
          <div className="flex items-start justify-between mb-4">
            <div
            className="text-4xl p-3 rounded-xl transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${cluster.color_hex}20` }}>
            
              {cluster.icon}
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              {cluster.policy_count} นโยบาย
            </span>
          </div>
          
          <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors" style={{ color: "#f97316", fontSize: "32px" }}>
            {cluster.short_name}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2" style={{ fontSize: "16px" }}>
            {cluster.name}
          </p>

          <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
            ดูนโยบายทั้งหมด
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      )}
    </div>);

}