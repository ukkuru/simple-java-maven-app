import type { AnalysisResult, Framework } from "@/types";
import { evaluateSmart } from "./smart";
import { evaluateInvest } from "./invest";
import { computeOverallScore, scoreLabelWithBand } from "@/lib/scoring/engine";
import { SCORING_EXPLANATION } from "@/lib/scoring/config";
import {
  buildStrengths,
  buildPriorityFixes,
  buildSummary,
  buildUserStoryIssues,
  buildAcceptanceCriteriaIssues,
} from "./summary";
import { rewriteUserStory, rewriteAcceptanceCriteria } from "./rewrite";

const USER_STORY_KEYS: Record<Framework, string[]> = {
  SMART: ["specific", "relevant", "achievable"],
  INVEST: ["independent", "negotiable", "valuable", "small"],
};

const AC_KEYS: Record<Framework, string[]> = {
  SMART: ["measurable", "timeBound"],
  INVEST: ["estimable", "testable"],
};

export function runHeuristicAnalysis(
  userStory: string,
  acceptanceCriteria: string,
  framework: Framework
): AnalysisResult {
  const criteria =
    framework === "SMART"
      ? evaluateSmart(userStory, acceptanceCriteria)
      : evaluateInvest(userStory, acceptanceCriteria);

  const overallScore = computeOverallScore(criteria);
  const scoreLabel = scoreLabelWithBand(overallScore);
  const summary = buildSummary(overallScore, scoreLabel, criteria, framework);
  const strengths = buildStrengths(criteria);
  const priorityFixes = buildPriorityFixes(criteria);
  const { text: rewrittenUserStory, rationale } = rewriteUserStory(userStory);
  const rewrittenAcceptanceCriteria = rewriteAcceptanceCriteria(acceptanceCriteria, userStory);

  return {
    framework,
    overallScore,
    scoreLabel,
    summary,
    criteria,
    userStoryIssues: buildUserStoryIssues(criteria, USER_STORY_KEYS[framework]),
    acceptanceCriteriaIssues: buildAcceptanceCriteriaIssues(criteria, AC_KEYS[framework]),
    strengths,
    priorityFixes,
    rewrittenUserStory,
    rewriteRationale: rationale,
    rewrittenAcceptanceCriteria,
    scoringExplanation: SCORING_EXPLANATION,
  };
}
