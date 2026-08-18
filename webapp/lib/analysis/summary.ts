import type { CriterionResult, IssuePriority, PriorityFix, Strength } from "@/types";

const STRENGTH_COPY: Record<string, (c: CriterionResult) => Strength | null> = {};

function genericStrength(c: CriterionResult): Strength {
  return {
    title: `${c.name} is in good shape`,
    explanation: c.assessment,
    relatedCriterion: c.name,
  };
}

export function buildStrengths(criteria: CriterionResult[]): Strength[] {
  return criteria
    .filter((c) => c.applicable && c.score !== null && c.score >= 80)
    .map((c) => (STRENGTH_COPY[c.key]?.(c)) ?? genericStrength(c))
    .slice(0, 6);
}

function priorityFromScore(score: number | null): IssuePriority {
  if (score === null) return "low";
  if (score < 50) return "high";
  if (score < 70) return "medium";
  return "low";
}

export function buildPriorityFixes(criteria: CriterionResult[]): PriorityFix[] {
  const fixes: PriorityFix[] = [];
  for (const c of criteria) {
    if (!c.applicable || c.issues.length === 0) continue;
    const priority = priorityFromScore(c.score);
    c.issues.forEach((issue, idx) => {
      const rec = c.recommendations[idx] ?? c.recommendations[0] ?? "Review this criterion with the team before starting work.";
      fixes.push({
        priority,
        title: `${c.name}: ${issue.length > 60 ? issue.slice(0, 57) + "..." : issue}`,
        problem: issue,
        whyItMatters: whyItMattersFor(c.key),
        recommendedFix: rec,
        relatedCriterion: c.name,
      });
    });
  }
  const order: Record<IssuePriority, number> = { high: 0, medium: 1, low: 2 };
  return fixes.sort((a, b) => order[a.priority] - order[b.priority]).slice(0, 10);
}

function whyItMattersFor(key: string): string {
  const map: Record<string, string> = {
    specific: "Ambiguity here forces developers and testers to guess intent, causing rework and mismatched expectations.",
    measurable: "Without a measurable definition of done, stakeholders may disagree on whether the story is actually complete.",
    achievable: "Underestimated scope or hidden dependencies are a leading cause of stories that spill over into extra sprints.",
    relevant: "If the value isn't clear, the team can't prioritize this story correctly against other work.",
    timeBound: "Missing timing constraints can lead to a feature shipping too late to matter, or being built without a real deadline in mind.",
    independent: "Hidden dependencies block delivery and make sprint planning unreliable.",
    negotiable: "Over-specifying implementation removes the team's ability to find a better technical solution.",
    valuable: "Work without clear value is hard to prioritize and easy to cut when trade-offs come up.",
    estimable: "Teams can't commit to a sprint plan when they can't confidently size the work.",
    small: "Oversized stories are more likely to be abandoned mid-sprint or shipped with cut corners.",
    testable: "If QA can't verify the outcome objectively, defects and scope disputes slip through to production.",
  };
  return map[key] ?? "This affects the team's ability to plan, build, and verify the work confidently.";
}

export function buildSummary(
  overallScore: number,
  scoreLabel: string,
  criteria: CriterionResult[],
  framework: string
): string {
  const applicable = criteria.filter((c) => c.applicable && c.score !== null);
  const strong = applicable.filter((c) => c.score! >= 80).map((c) => c.name);
  const weak = applicable
    .filter((c) => c.score! < 70)
    .sort((a, b) => a.score! - b.score!)
    .map((c) => c.name);

  let sentence = `This story scores ${overallScore}/100 against ${framework} (${scoreLabel}).`;
  if (strong.length > 0) {
    sentence += ` It is strong on ${joinWithAnd(strong)}.`;
  }
  if (weak.length > 0) {
    sentence += ` The biggest opportunities are ${joinWithAnd(weak)}.`;
  } else if (strong.length > 0) {
    sentence += " No criterion needs urgent attention, though small refinements are still noted below.";
  }
  return sentence;
}

function joinWithAnd(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function buildUserStoryIssues(criteria: CriterionResult[], relevantKeys: string[]): string[] {
  return criteria
    .filter((c) => relevantKeys.includes(c.key))
    .flatMap((c) => c.issues);
}

export function buildAcceptanceCriteriaIssues(criteria: CriterionResult[], relevantKeys: string[]): string[] {
  return criteria
    .filter((c) => relevantKeys.includes(c.key))
    .flatMap((c) => c.issues);
}
