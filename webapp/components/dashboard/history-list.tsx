import Link from "next/link";
import type { AnalysisRecord } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreDelta } from "@/components/charts/score-delta";
import { formatDate } from "@/lib/utils/date";
import { getScoreLabel } from "@/lib/scoring/config";

export function HistoryList({ records, emptyHint }: { records: AnalysisRecord[]; emptyHint?: string }) {
  if (records.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center text-sm text-[rgb(var(--text-muted))]">
          {emptyHint ?? "No analyses yet."}
        </div>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {records.map((r) => (
        <li key={r.id}>
          <Link
            href={`/history/${r.id}`}
            className="focus-ring block rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-sm transition-colors hover:border-brand-300 hover:bg-[rgb(var(--surface-2))]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{r.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[rgb(var(--text-muted))]">
                  <Badge tone="brand">{r.framework}</Badge>
                  <span>{formatDate(r.createdAt)}</span>
                  <span>{getScoreLabel(r.overallScore)}</span>
                </div>
              </div>
              <div className="shrink-0">
                {typeof r.previousScore === "number" ? (
                  <ScoreDelta from={r.previousScore} to={r.overallScore} />
                ) : (
                  <span className="text-lg font-bold tabular-nums">{r.overallScore}<span className="text-xs font-normal text-[rgb(var(--text-muted))]"> /100</span></span>
                )}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
