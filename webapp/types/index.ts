export type Framework = "SMART" | "INVEST";

export type CriterionStatus =
  | "strong"
  | "good"
  | "needs_improvement"
  | "poor"
  | "not_applicable";

export interface CriterionResult {
  key: string;
  name: string;
  score: number | null;
  weight: number;
  status: CriterionStatus;
  assessment: string;
  issues: string[];
  recommendations: string[];
  applicable: boolean;
}

export type IssuePriority = "high" | "medium" | "low";

export interface PriorityFix {
  priority: IssuePriority;
  title: string;
  problem: string;
  whyItMatters: string;
  recommendedFix: string;
  example?: string;
  relatedCriterion: string;
}

export interface Strength {
  title: string;
  explanation: string;
  relatedCriterion: string;
}

export interface RewrittenScenario {
  title: string;
  given: string;
  when: string;
  then: string;
}

export interface AnalysisResult {
  framework: Framework;
  overallScore: number;
  scoreLabel: string;
  summary: string;
  criteria: CriterionResult[];
  userStoryIssues: string[];
  acceptanceCriteriaIssues: string[];
  strengths: Strength[];
  priorityFixes: PriorityFix[];
  rewrittenUserStory: string;
  rewriteRationale: string[];
  rewrittenAcceptanceCriteria: RewrittenScenario[];
  scoringExplanation: string;
}

export interface AnalyzeRequest {
  userStory: string;
  acceptanceCriteria: string;
  framework: Framework;
}

export interface AnalysisRecord {
  id: string;
  title: string;
  framework: Framework;
  userStory: string;
  acceptanceCriteria: string;
  overallScore: number;
  previousScore: number | null;
  result: AnalysisResult;
  createdAt: string;
}

export interface Template {
  id: string;
  category: string;
  title: string;
  userStory: string;
  acceptanceCriteria: string;
  quality: "excellent" | "good" | "average" | "poor" | "very_poor";
}
