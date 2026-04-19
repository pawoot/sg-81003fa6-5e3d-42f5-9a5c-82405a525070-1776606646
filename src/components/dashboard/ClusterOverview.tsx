import { useEffect, useState } from "react";
import { getClustersWithCount } from "@/services/clusterService";
import type { Cluster } from "@/lib/types";

export function ClusterOverview() {
  const [clusters, setClusters] = useState<(Cluster & { policy_count: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClusters() {
      const data = await getClustersWithCount();
      setClusters(data);
      setLoading(false);
    }
    loadClusters();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-white border-l-4 border-gray-300 rounded-lg p-6 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-muted rounded"></div>
              <div className="flex-1">
                <div className="h-5 w-32 bg-muted rounded mb-2"></div>
                <div className="h-4 w-24 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clusters.map(cluster => (
        <div
          key={cluster.id}
          className="bg-white border-l-4 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
          style={{ borderLeftColor: cluster.color_hex }}
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">{cluster.icon}</span>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-lg mb-1">{cluster.short_name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {cluster.policy_count} นโยบาย
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}