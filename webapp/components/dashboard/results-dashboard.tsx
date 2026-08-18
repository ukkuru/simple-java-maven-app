import type { AnalysisResult } from "@/types";
import { ScoreOverview } from "./score-overview";
import { CriteriaBreakdown } from "./criteria-breakdown";
import { StrengthsSection } from "./strengths-section";
import { PriorityFixesSection } from "./priority-fixes-section";
import { RewrittenStorySection } from "./rewritten-story-section";
import { RewrittenAcSection } from "./rewritten-ac-section";
import { ComparisonView } from "./comparison-view";

export function ResultsDashboard({
  result,
  originalUserStory,
  originalAcceptanceCriteria,
  previousScore,
  onUseRewrittenStory,
  onUseRewrittenAc,
}: {
  result: AnalysisResult;
  originalUserStory: string;
  originalAcceptanceCriteria: string;
  previousScore?: number | null;
  onUseRewrittenStory?: (text: string) => void;
  onUseRewrittenAc?: (text: string) => void;
}) {
  return (
    <div className="space-y-8">
      <ScoreOverview result={result} previousScore={previousScore} />
      <StrengthsSection strengths={result.strengths} />
      <PriorityFixesSection fixes={result.priorityFixes} />
      <CriteriaBreakdown criteria={result.criteria} />
      <RewrittenStorySection
        rewrittenUserStory={result.rewrittenUserStory}
        rationale={result.rewriteRationale}
        onUseVersion={onUseRewrittenStory}
      />
      <RewrittenAcSection scenarios={result.rewrittenAcceptanceCriteria} onUseVersion={onUseRewrittenAc} />
      <ComparisonView
        originalUserStory={originalUserStory}
        improvedUserStory={result.rewrittenUserStory}
        originalAcceptanceCriteria={originalAcceptanceCriteria}
        improvedAcceptanceCriteria={result.rewrittenAcceptanceCriteria}
      />
    </div>
  );
}
