import { useEffect, useState } from "react";
import { ThumbsUp, HelpCircle, ThumbsDown } from "lucide-react";

interface VoteCounts {
  trust: number;
  doubt: number;
  distrust: number;
  total: number;
}

interface PublicVoteProps {
  policyId: string;
}

export function PublicVote({ policyId }: PublicVoteProps) {
  const [counts, setCounts] = useState<VoteCounts>({
    trust: 0,
    doubt: 0,
    distrust: 0,
    total: 0,
  });
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch vote counts
  useEffect(() => {
    fetchVotes();
  }, [policyId]);

  async function fetchVotes() {
    try {
      const response = await fetch(`/api/votes?policy_id=${policyId}`);
      if (response.ok) {
        const data = await response.json();
        setCounts(data);
      }
    } catch (err) {
      console.error("Error fetching votes:", err);
    }
  }

  async function submitVote(vote: "trust" | "doubt" | "distrust") {
    if (hasVoted || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policy_id: policyId, vote }),
      });

      if (response.status === 409) {
        setError("คุณได้โหวตนโยบายนี้แล้ววันนี้");
        setHasVoted(true);
      } else if (response.ok) {
        setHasVoted(true);
        await fetchVotes(); // Refresh counts
      } else {
        const data = await response.json();
        setError(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (err) {
      console.error("Vote submission error:", err);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsSubmitting(false);
    }
  }

  const trustPercent = counts.total > 0 ? (counts.trust / counts.total) * 100 : 0;
  const doubtPercent = counts.total > 0 ? (counts.doubt / counts.total) * 100 : 0;
  const distrustPercent = counts.total > 0 ? (counts.distrust / counts.total) * 100 : 0;

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="font-heading font-semibold text-lg mb-4">
        ความเห็นของประชาชน
      </h3>

      {/* Vote Buttons */}
      {!hasVoted && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => submitVote("trust")}
            disabled={isSubmitting}
            className="flex flex-col items-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 hover:border-emerald-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ThumbsUp className="w-6 h-6 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">เชื่อถือ</span>
          </button>

          <button
            onClick={() => submitVote("doubt")}
            disabled={isSubmitting}
            className="flex flex-col items-center gap-2 p-4 bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 hover:border-amber-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HelpCircle className="w-6 h-6 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">สงสัย</span>
          </button>

          <button
            onClick={() => submitVote("distrust")}
            disabled={isSubmitting}
            className="flex flex-col items-center gap-2 p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ThumbsDown className="w-6 h-6 text-red-600" />
            <span className="text-sm font-medium text-red-700">ไม่เชื่อถือ</span>
          </button>
        </div>
      )}

      {hasVoted && (
        <div className="bg-muted rounded-lg p-3 mb-6 text-center text-sm text-muted-foreground">
          ขอบคุณสำหรับความเห็นของคุณ
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Vote Results */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-24">
            <ThumbsUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium">เชื่อถือ</span>
          </div>
          <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${trustPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold w-16 text-right">
            {counts.trust} ({Math.round(trustPercent)}%)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-24">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium">สงสัย</span>
          </div>
          <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${doubtPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold w-16 text-right">
            {counts.doubt} ({Math.round(doubtPercent)}%)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-24">
            <ThumbsDown className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium">ไม่เชื่อถือ</span>
          </div>
          <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
            <div
              className="bg-red-500 h-full transition-all duration-300"
              style={{ width: `${distrustPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold w-16 text-right">
            {counts.distrust} ({Math.round(distrustPercent)}%)
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground text-center">
        ยอดรวม {counts.total.toLocaleString("th-TH")} โหวต
        <span className="block text-xs mt-1">
          (1 โหวตต่อ IP ต่อนโยบายต่อวัน)
        </span>
      </div>
    </div>
  );
}