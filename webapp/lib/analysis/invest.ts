import type { CriterionResult } from "@/types";
import { INVEST_CRITERIA, getStatusForScore } from "@/lib/scoring/config";
import {
  parseUserStory,
  findVagueTerms,
  findDependencyHints,
  detectMultiplePersonas,
  countAndChains,
  wordCount,
  splitAcceptanceCriteria,
  isGwtFormat,
  hasMeasurableTerms,
} from "./textUtils";
import { clampScore } from "@/lib/scoring/engine";

function weightOf(key: string): number {
  return INVEST_CRITERIA.find((c) => c.key === key)?.weight ?? 0;
}

function build(
  key: string,
  name: string,
  score: number | null,
  assessment: string,
  issues: string[],
  recommendations: string[],
  applicable = true
): CriterionResult {
  return {
    key,
    name,
    score: score === null ? null : clampScore(score),
    weight: weightOf(key),
    status: getStatusForScore(score),
    assessment,
    issues,
    recommendations,
    applicable,
  };
}

export function evaluateInvest(
  userStory: string,
  acceptanceCriteria: string
): CriterionResult[] {
  const parsed = parseUserStory(userStory);
  const results: CriterionResult[] = [];
  const combined = `${userStory}\n${acceptanceCriteria}`;

  // Independent
  {
    const deps = findDependencyHints(combined);
    let score = 95;
    const issues: string[] = [];
    const recs: string[] = [];
    if (deps.length > 0) {
      score -= Math.min(35, deps.length * 15);
      issues.push(`The story references ${deps.slice(0, 3).join(", ")}, suggesting it depends on other work being in place.`);
      recs.push("Clarify the dependency explicitly, confirm it's already delivered, or split the story so the dependency is tracked separately.");
    }
    results.push(
      build(
        "independent",
        "Independent",
        score,
        deps.length > 0
          ? "The story appears to depend on existing systems or other in-flight work, which limits how independently it can be delivered."
          : "The story doesn't show obvious dependencies on other stories or systems.",
        issues,
        recs
      )
    );
  }

  // Negotiable
  {
    let score = 92;
    const issues: string[] = [];
    const recs: string[] = [];
    const implementationSignals = /\b(button|dropdown|api endpoint|database table|sql|json field|css|html|microservice|class|function|algorithm)\b/i;
    if (implementationSignals.test(userStory)) {
      score -= 25;
      issues.push("The story prescribes specific implementation details rather than describing the desired outcome.");
      recs.push("Describe the outcome the user needs and leave implementation choices (UI widgets, data structures, tech stack) to the team.");
    }
    if (wordCount(userStory) > 150) {
      score -= 10;
      issues.push("The story is long enough that it may be over-specifying how the solution should work.");
      recs.push("Trim the story to the core need and move implementation notes to a separate technical discussion.");
    }
    results.push(
      build(
        "negotiable",
        "Negotiable",
        score,
        implementationSignals.test(userStory)
          ? "The story locks in implementation details that should be left open for discussion between the team and stakeholders."
          : "The story focuses on outcome rather than prescribing a specific implementation, leaving room for negotiation.",
        issues,
        recs
      )
    );
  }

  // Valuable
  {
    let score = 55;
    const issues: string[] = [];
    const recs: string[] = [];
    if (parsed.benefit && wordCount(parsed.benefit) >= 3) {
      score += 35;
    } else {
      issues.push('No clear "so that" value statement was found.');
      recs.push("State who benefits and how, e.g. \"so that I can track my order without contacting support\".");
      score -= 15;
    }
    const genericValue = parsed.benefit && /^(it works|it is better|users? (are|is) happy)/i.test(parsed.benefit);
    if (genericValue) {
      score -= 15;
      issues.push("The stated value is generic and doesn't explain the real user or business benefit.");
      recs.push("Replace the generic benefit with a specific, measurable outcome.");
    }
    const vagueBenefit = parsed.benefit ? findVagueTerms(parsed.benefit) : [];
    if (vagueBenefit.length > 0) {
      score -= Math.min(30, vagueBenefit.length * 12);
      issues.push(`The stated value relies on subjective terms (${vagueBenefit.slice(0, 3).join(", ")}) rather than a concrete outcome.`);
      recs.push("Describe the value in terms of a concrete outcome (time saved, errors avoided, revenue enabled) instead of subjective adjectives.");
    }
    results.push(
      build(
        "valuable",
        "Valuable",
        score,
        parsed.benefit
          ? `The story states a benefit: "${parsed.benefit}".`
          : "The value delivered to the user or business is unclear from the story as written.",
        issues,
        recs
      )
    );
  }

  // Estimable
  {
    let score = 40;
    const issues: string[] = [];
    const recs: string[] = [];
    const vague = findVagueTerms(userStory);
    const acBlocks = splitAcceptanceCriteria(acceptanceCriteria);
    if (parsed.matchesStandardForm) {
      score += 20;
    } else {
      issues.push("Because the story isn't clearly structured, the team may struggle to agree on what's in scope for estimation.");
      recs.push('Use the standard "As a / I want / so that" structure so scope is unambiguous.');
    }
    if (vague.length === 0) {
      score += 15;
    } else if (vague.length === 1) {
      score -= 5;
      issues.push("A vague term makes it harder for the team to agree on the size of the work.");
      recs.push("Replace vague language with concrete, specific requirements before estimating.");
    } else {
      score -= 10 + Math.min(15, (vague.length - 1) * 5);
      issues.push("Multiple vague terms make it hard for the team to agree on the size of the work.");
      recs.push("Replace vague language with concrete, specific requirements before estimating.");
    }
    if (acBlocks.length > 0 && acceptanceCriteria.trim()) {
      score += 25;
    } else {
      issues.push("No acceptance criteria are provided, so the team lacks the detail needed to size the work confidently.");
      recs.push("Add acceptance criteria so the team can identify edge cases that affect the estimate.");
    }
    results.push(
      build(
        "estimable",
        "Estimable",
        score,
        acceptanceCriteria.trim() && parsed.matchesStandardForm && vague.length <= 2
          ? "The story and its acceptance criteria give the team enough detail to produce a reasonable estimate."
          : "Ambiguity or missing detail would likely force the team to make assumptions before estimating.",
        issues,
        recs
      )
    );
  }

  // Small
  {
    let score = 90;
    const issues: string[] = [];
    const recs: string[] = [];
    // Bundled scope can show up in the goal ("I want X and Y") or spill into
    // the benefit clause ("so I can X and it should Y and Z") when a story
    // uses "so ..." without "that" — check both, not just the goal, or a
    // story that bundles everything after "so" reads as falsely small.
    const goalText = [parsed.goal, parsed.benefit].filter(Boolean).join(" ") || userStory;
    const andCount = countAndChains(goalText);
    const personas = detectMultiplePersonas(userStory);
    const acBlocks = splitAcceptanceCriteria(acceptanceCriteria);

    if (andCount >= 2) {
      score -= Math.min(60, 20 + andCount * 10);
      issues.push(`The goal chains ${andCount} "and"s together, bundling multiple capabilities into one story.`);
      recs.push("Split the story so each independently valuable capability becomes its own story.");
    } else if (andCount === 1) {
      score -= 10;
      issues.push('The goal contains an "and", which may combine two capabilities.');
      recs.push("Confirm whether the two parts joined by \"and\" can be delivered and demoed separately.");
    }
    if (personas.length > 1) {
      score -= 15;
      issues.push(`Multiple personas are referenced (${personas.slice(0, 3).join(", ")}), which often signals the story covers more than one workflow.`);
      recs.push("Split by persona so each story targets a single primary user.");
    }
    if (acBlocks.length > 7) {
      score -= 15;
      issues.push(`There are ${acBlocks.length} acceptance criteria, which is a lot for a single story to satisfy in one iteration.`);
      recs.push("Consider splitting the story so each slice has a smaller, focused set of acceptance criteria.");
    }
    results.push(
      build(
        "small",
        "Small",
        score,
        andCount >= 2 || personas.length > 1
          ? "The story bundles enough scope that it likely can't be completed within a single sprint as written."
          : "The story appears reasonably sized for a single iteration.",
        issues,
        recs
      )
    );
  }

  // Testable
  {
    let score = 40;
    const issues: string[] = [];
    const recs: string[] = [];
    const acBlocks = splitAcceptanceCriteria(acceptanceCriteria);
    const gwtCount = acBlocks.filter((b) => isGwtFormat(b)).length;
    const vagueInAc = findVagueTerms(acceptanceCriteria);

    if (acBlocks.length === 0 || !acceptanceCriteria.trim()) {
      issues.push("No acceptance criteria were provided, so completion cannot be objectively verified.");
      recs.push("Add at least one Given/When/Then or checklist-style acceptance criterion.");
      score = 10;
    } else {
      score = 60;
      if (gwtCount === acBlocks.length) {
        score += 15;
      } else if (gwtCount > 0) {
        score += 8;
        recs.push("Consider using Given/When/Then for every scenario so each is unambiguous for QA.");
      } else {
        recs.push("Consider using Given/When/Then to make each scenario unambiguous for QA.");
      }
      if (acBlocks.length >= 2) score += 5;
      if (hasMeasurableTerms(acceptanceCriteria)) score += 10;
      if (vagueInAc.length > 0) {
        score -= Math.min(25, vagueInAc.length * 8);
        issues.push(`Some acceptance criteria rely on subjective language (${vagueInAc.slice(0, 3).join(", ")}) instead of objective, testable conditions.`);
        recs.push("Rewrite subjective criteria as pass/fail conditions with concrete inputs and expected outputs.");
      }
      if (!hasMeasurableTerms(acceptanceCriteria) && vagueInAc.length > 0) {
        issues.push("None of the criteria include a measurable threshold where one would help remove ambiguity.");
      }
    }

    results.push(
      build(
        "testable",
        "Testable",
        score,
        acBlocks.length > 0
          ? `${acBlocks.length} acceptance criteri${acBlocks.length === 1 ? "on was" : "a were"} found${gwtCount > 0 ? `, ${gwtCount} in Given/When/Then format` : ""}.`
          : "No acceptance criteria were supplied to verify completion against.",
        issues,
        recs
      )
    );
  }

  return results;
}
