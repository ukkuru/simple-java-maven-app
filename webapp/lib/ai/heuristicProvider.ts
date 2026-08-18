import type { AnalysisProvider } from "./provider";
import type { AnalysisResult, AnalyzeRequest } from "@/types";
import { runHeuristicAnalysis } from "@/lib/analysis";

/**
 * Deterministic, rule-based analysis engine. Requires no API key and always
 * works, so it's the default provider and the safety net the app can fall
 * back on when no external AI credentials are configured. It implements the
 * same AnalysisProvider contract as any LLM-backed provider so it can be
 * swapped transparently.
 */
export class HeuristicProvider implements AnalysisProvider {
  readonly name = "heuristic";

  async analyze(input: AnalyzeRequest): Promise<AnalysisResult> {
    return runHeuristicAnalysis(input.userStory, input.acceptanceCriteria, input.framework);
  }
}
