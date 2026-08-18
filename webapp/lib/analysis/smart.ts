import type { CriterionResult } from "@/types";
import { SMART_CRITERIA } from "@/lib/scoring/config";
import { getStatusForScore } from "@/lib/scoring/config";
import {
  parseUserStory,
  findVagueTerms,
  hasMeasurableTerms,
  findTimeReferences,
  findDependencyHints,
  countAndChains,
  wordCount,
  splitAcceptanceCriteria,
} from "./textUtils";
import { clampScore } from "@/lib/scoring/engine";

function weightOf(key: string): number {
  return SMART_CRITERIA.find((c) => c.key === key)?.weight ?? 0;
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

export function evaluateSmart(
  userStory: string,
  acceptanceCriteria: string
): CriterionResult[] {
  const parsed = parseUserStory(userStory);
  const results: CriterionResult[] = [];

  // Specific
  {
    const issues: string[] = [];
    const recs: string[] = [];
    let score = 45;
    if (!parsed.matchesStandardForm) {
      issues.push('The story does not follow the "As a / I want / so that" structure, making the persona and goal harder to pin down.');
      recs.push('Rewrite using "As a [persona], I want [capability], so that [benefit]" to make each element explicit.');
      score -= 20;
    } else {
      score += 20;
      if (parsed.persona && parsed.persona.length >= 3 && parsed.persona.toLowerCase() !== "user") {
        score += 15;
      } else {
        issues.push("The persona is missing or too generic (e.g. just \"user\").");
        recs.push("Name a specific role or persona (e.g. \"registered customer\", \"warehouse manager\") instead of a generic \"user\".");
        score -= 15;
      }
      if (parsed.goal && wordCount(parsed.goal) >= 2) {
        score += 15;
      } else {
        issues.push("The requested capability is not clearly stated.");
        recs.push("Describe precisely what the user wants to do, using a concrete verb and object.");
        score -= 15;
      }
    }
    const vague = findVagueTerms(userStory);
    if (vague.length > 0) {
      issues.push(`Vague terminology detected: ${vague.slice(0, 5).join(", ")}. These words mean different things to different readers.`);
      recs.push(`Replace vague terms (${vague.slice(0, 3).join(", ")}) with concrete, observable behavior.`);
      score -= Math.min(20, vague.length * 6);
    }
    results.push(
      build(
        "specific",
        "Specific",
        score,
        parsed.matchesStandardForm
          ? `The story identifies a persona ("${parsed.persona ?? "unspecified"}") and a goal ("${parsed.goal ?? "unspecified"}").${vague.length ? " However, some wording is ambiguous." : " The wording is concrete."}`
          : "The story does not follow a standard structure, so the persona and goal must be inferred rather than read directly.",
        issues,
        recs
      )
    );
  }

  // Measurable
  {
    const issues: string[] = [];
    const recs: string[] = [];
    const acBlocks = splitAcceptanceCriteria(acceptanceCriteria);
    const measurableBlocks = acBlocks.filter((b) => hasMeasurableTerms(b));
    const vagueInAc = findVagueTerms(acceptanceCriteria);
    let score = 40;

    if (acBlocks.length === 0 || !acceptanceCriteria.trim()) {
      issues.push("No acceptance criteria were supplied, so success cannot be objectively evaluated.");
      recs.push("Add acceptance criteria with concrete, checkable conditions for \"done\".");
      score = 15;
    } else {
      score += Math.min(40, measurableBlocks.length * 20);
      if (acBlocks.length >= 2) score += 10;
      if (measurableBlocks.length === 0) {
        issues.push("None of the acceptance criteria contain a quantifiable condition (a number, percentage, or time bound).");
        recs.push('Where relevant, add measurable thresholds, e.g. "loads within 2 seconds for 95% of requests" instead of "loads quickly".');
      }
      if (vagueInAc.length > 0) {
        issues.push(`Acceptance criteria use subjective terms (${vagueInAc.slice(0, 3).join(", ")}) that different testers could interpret differently.`);
        recs.push("Rewrite subjective acceptance criteria as pass/fail conditions a tester can verify without judgment calls.");
        score -= Math.min(20, vagueInAc.length * 6);
      }
    }
    results.push(
      build(
        "measurable",
        "Measurable",
        score,
        measurableBlocks.length > 0
          ? "At least one acceptance criterion includes a quantifiable, verifiable condition."
          : "The acceptance criteria describe expected behavior but mostly lack quantifiable conditions.",
        issues,
        recs
      )
    );
  }

  // Achievable
  {
    const issues: string[] = [];
    const recs: string[] = [];
    let score = 95;
    const andCount = parsed.goal ? countAndChains(parsed.goal) : countAndChains(userStory);
    const deps = findDependencyHints(userStory + " " + acceptanceCriteria);
    if (andCount >= 2) {
      issues.push("The goal bundles several distinct capabilities together, which increases delivery risk.");
      recs.push("Reduce scope to a single capability, or explicitly note that this is an epic to be split.");
      score -= 20;
    }
    if (deps.length > 0) {
      issues.push(`The story references dependencies or integrations (${deps.slice(0, 3).join(", ")}) without describing how they're handled.`);
      recs.push("Call out dependencies explicitly and confirm they are already available, or plan for them separately.");
      score -= 10;
    }
    if (wordCount(userStory) > 120) {
      issues.push("The story is unusually long for a single unit of work, which often signals excessive scope.");
      recs.push("Trim the story to the essential capability; move supporting detail into acceptance criteria or a linked spec.");
      score -= 10;
    }
    results.push(
      build(
        "achievable",
        "Achievable",
        score,
        andCount >= 2 || deps.length > 0
          ? "The scope or dependencies introduce some feasibility risk that should be addressed before committing to a sprint."
          : "The requested functionality reads as realistic and technically feasible as scoped.",
        issues,
        recs
      )
    );
  }

  // Relevant
  {
    const issues: string[] = [];
    const recs: string[] = [];
    let score = 55;
    if (parsed.benefit && wordCount(parsed.benefit) >= 3) {
      score += 35;
    } else if (parsed.matchesStandardForm) {
      issues.push('The "so that" clause is missing or too thin to explain why this matters.');
      recs.push('Add a clear "so that [benefit]" clause that states the user or business value.');
      score -= 20;
    } else {
      issues.push("Because the story doesn't follow the standard structure, no explicit value statement could be found.");
      recs.push("State the business or user value explicitly, ideally with a \"so that\" clause.");
      score -= 25;
    }
    const genericBenefits = ["so that it works", "so that it is better", "so that users are happy"];
    if (parsed.benefit && genericBenefits.some((g) => parsed.benefit!.toLowerCase().includes(g.replace("so that ", "")))) {
      issues.push("The stated benefit is generic and doesn't explain the actual value delivered.");
      recs.push("Replace the generic benefit with a specific outcome (time saved, risk reduced, revenue enabled, etc.).");
      score -= 15;
    }
    const vagueBenefit = parsed.benefit ? findVagueTerms(parsed.benefit) : [];
    if (vagueBenefit.length > 0) {
      score -= Math.min(30, vagueBenefit.length * 12);
      issues.push(`The stated value relies on subjective terms (${vagueBenefit.slice(0, 3).join(", ")}) rather than a concrete outcome.`);
      recs.push("Describe the value in terms of a concrete outcome instead of subjective adjectives like these.");
    }
    results.push(
      build(
        "relevant",
        "Relevant",
        score,
        parsed.benefit
          ? `The story explains its value: "${parsed.benefit}".`
          : "The story does not clearly explain why the capability matters to the user or the business.",
        issues,
        recs
      )
    );
  }

  // Time-bound
  {
    const combined = `${userStory}\n${acceptanceCriteria}`;
    const timeRefs = findTimeReferences(combined);
    const measurablePerf = hasMeasurableTerms(acceptanceCriteria);
    const looksTimeSensitive = /deadline|launch|compliance|regulat|expir|renew/i.test(combined);

    if (!looksTimeSensitive && timeRefs.length === 0) {
      results.push(
        build(
          "timeBound",
          "Time-bound",
          null,
          "This story does not appear to depend on a specific timeframe, and none is needed. A hard deadline would be forced and out of place here — Time-bound is being treated as not applicable rather than penalized.",
          [],
          [],
          false
        )
      );
    } else {
      const issues: string[] = [];
      const recs: string[] = [];
      let score = 60;
      if (timeRefs.length > 0) {
        score += 25;
      } else {
        issues.push("The story implies a time-sensitive constraint (e.g. compliance, expiry, or a launch) but doesn't state it.");
        recs.push("Make the relevant timeframe explicit, e.g. an expiry window, SLA, or compliance deadline.");
        score -= 15;
      }
      if (measurablePerf) score += 10;
      results.push(
        build(
          "timeBound",
          "Time-bound",
          score,
          timeRefs.length > 0
            ? "A relevant timeframe or time constraint is present."
            : "The context suggests timing matters, but no explicit timeframe is stated.",
          issues,
          recs
        )
      );
    }
  }

  return results;
}
