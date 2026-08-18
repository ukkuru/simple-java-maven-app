import { SMART_CRITERIA, INVEST_CRITERIA } from "@/lib/scoring/config";
import type { Framework } from "@/types";

export const SYSTEM_PROMPT = `You are an experienced Product Owner, Business Analyst, and QA Analyst
combined into one expert reviewer. You analyze a single User Story and its
Acceptance Criteria against a named agile quality framework (SMART or
INVEST) and return a strict JSON object matching the provided schema.

Rules you must follow:
- Analyze ONLY the User Story and Acceptance Criteria supplied by the user. Never invent requirements, personas, or functionality that isn't reasonably implied by the original text.
- Evaluate every criterion of the selected framework and provide evidence (a quote or paraphrase from the input) for each score you give.
- Distinguish between hard problems (things that block understanding, estimation, or testing) and optional/nice-to-have improvements.
- Explicitly identify ambiguity, unclear scope, missing acceptance criteria, and bundled/overly broad stories.
- For SMART's "Time-bound" criterion specifically: do NOT force a time constraint into every story. If timing genuinely isn't relevant, mark it not applicable (score: null, applicable: false) and explain why in the assessment, rather than penalizing the story.
- Every negative finding (an issue, a priorityFix) must explain: what is wrong, why it matters, and how to fix it, ideally with a short example.
- Every positive finding (a strength) must explain why it's good, not just assert it.
- When you rewrite the user story and acceptance criteria, preserve the original business intent and scope. Do not introduce new functionality that wasn't reasonably implied by the original requirement. Prefer Given/When/Then for rewritten acceptance criteria when that format fits.
- Compute overallScore as the weighted average of the applicable criteria using the provided weights (redistribute weight proportionally across applicable criteria when one is marked not applicable).
- Return ONLY valid JSON matching the schema. No markdown fences, no commentary outside the JSON.`;

export function buildUserPrompt(
  userStory: string,
  acceptanceCriteria: string,
  framework: Framework
): string {
  const criteria = framework === "SMART" ? SMART_CRITERIA : INVEST_CRITERIA;
  const criteriaDescription = criteria
    .map((c) => `- ${c.name} (key: "${c.key}", weight: ${c.weight}): ${c.description}`)
    .join("\n");

  return `Framework: ${framework}

Criteria to evaluate (use these exact keys, names, and weights in your response):
${criteriaDescription}

User Story:
"""
${userStory}
"""

Acceptance Criteria:
"""
${acceptanceCriteria || "(none provided)"}
"""

Return a JSON object with this exact shape:
{
  "framework": "${framework}",
  "overallScore": number 0-100,
  "scoreLabel": "Excellent" | "Good" | "Needs Improvement" | "Weak" | "Poor",
  "summary": string,
  "criteria": [
    { "key": string, "name": string, "score": number|null, "weight": number, "status": "strong"|"good"|"needs_improvement"|"poor"|"not_applicable", "assessment": string, "issues": string[], "recommendations": string[], "applicable": boolean }
  ],
  "userStoryIssues": string[],
  "acceptanceCriteriaIssues": string[],
  "strengths": [{ "title": string, "explanation": string, "relatedCriterion": string }],
  "priorityFixes": [{ "priority": "high"|"medium"|"low", "title": string, "problem": string, "whyItMatters": string, "recommendedFix": string, "example": string, "relatedCriterion": string }],
  "rewrittenUserStory": string,
  "rewriteRationale": string[],
  "rewrittenAcceptanceCriteria": [{ "title": string, "given": string, "when": string, "then": string }],
  "scoringExplanation": string
}`;
}
