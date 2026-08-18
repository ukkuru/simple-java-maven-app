import { Info } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { ScoreRing } from "@/components/charts/score-ring";
import { ScoreDelta } from "@/components/charts/score-delta";

export function ScoreOverview({
  result,
  previousScore,
}: {
  result: AnalysisResult;
  previousScore?: number | null;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[auto,1fr] md:items-center">
        <div className="flex flex-col items-center gap-2 justify-self-center">
          <ScoreRing score={result.overallScore} label={result.scoreLabel} />
          {typeof previousScore === "number" && (
            <ScoreDelta from={previousScore} to={result.overallScore} />
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{result.framework}</Badge>
            <span className="text-xs text-[rgb(var(--text-muted))]">Overall Quality</span>
            <Tooltip content={result.scoringExplanation}>
              <Info className="h-3.5 w-3.5 cursor-help text-[rgb(var(--text-muted))]" />
            </Tooltip>
          </div>
          <h2 className="mt-2 text-lg font-semibold">Executive Summary</h2>
          <p className="mt-1 text-sm leading-relaxed text-[rgb(var(--text-muted))]">{result.summary}</p>
        </div>
      </div>
    </Card>
  );
}
