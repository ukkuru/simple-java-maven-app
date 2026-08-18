import { z } from "zod";

/**
 * Strict schema the AI provider's structured output must conform to.
 * Used to validate LLM responses before they're trusted by the UI.
 */
export const criterionResultSchema = z.object({
  key: z.string(),
  name: z.string(),
  score: z.number().min(0).max(100).nullable(),
  weight: z.number(),
  status: z.enum(["strong", "good", "needs_improvement", "poor", "not_applicable"]),
  assessment: z.string(),
  issues: z.array(z.string()),
  recommendations: z.array(z.string()),
  applicable: z.boolean(),
});

export const priorityFixSchema = z.object({
  priority: z.enum(["high", "medium", "low"]),
  title: z.string(),
  problem: z.string(),
  whyItMatters: z.string(),
  recommendedFix: z.string(),
  example: z.string().optional(),
  relatedCriterion: z.string(),
});

export const strengthSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  relatedCriterion: z.string(),
});

export const rewrittenScenarioSchema = z.object({
  title: z.string(),
  given: z.string(),
  when: z.string(),
  then: z.string(),
});

export const analysisResultSchema = z.object({
  framework: z.enum(["SMART", "INVEST"]),
  overallScore: z.number().min(0).max(100),
  scoreLabel: z.string(),
  summary: z.string(),
  criteria: z.array(criterionResultSchema).min(1),
  userStoryIssues: z.array(z.string()),
  acceptanceCriteriaIssues: z.array(z.string()),
  strengths: z.array(strengthSchema),
  priorityFixes: z.array(priorityFixSchema),
  rewrittenUserStory: z.string(),
  rewriteRationale: z.array(z.string()),
  rewrittenAcceptanceCriteria: z.array(rewrittenScenarioSchema),
  scoringExplanation: z.string(),
});
