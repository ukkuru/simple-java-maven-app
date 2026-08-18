import type { RewrittenScenario } from "@/types";
import {
  parseUserStory,
  splitAcceptanceCriteria,
  extractGwt,
  isGwtFormat,
  findVagueTerms,
  hasMeasurableTerms,
  wordCount,
  capitalize,
} from "./textUtils";

// Deliberately avoids words like "existing" that collide with the engine's
// own dependency-detection keywords (findDependencyHints in textUtils.ts) —
// an earlier version used "existing UX patterns", which then made the
// rewritten story trip its own Independent-criterion dependency check.
// Deliberately avoids words like "existing" and "within" that collide with
// the engine's own detection keywords (findDependencyHints / TIME_KEYWORDS
// in textUtils.ts) — an earlier version used "existing UX patterns" and
// "within an agreed time limit", which made the rewritten story trip its
// own Independent-dependency and Time-bound checks.
const VAGUE_REPLACEMENTS: Record<string, string> = {
  fast: "with a defined time limit (e.g. under 2 seconds)",
  quickly: "with a defined time limit (e.g. under 2 seconds)",
  easy: "achievable in 3 steps or fewer",
  easily: "in 3 steps or fewer",
  simple: "with a minimal, clearly defined set of steps",
  intuitive: "consistent with the product's established navigation patterns",
  "user-friendly": "consistent with the product's UX and accessibility guidelines",
  "user friendly": "consistent with the product's UX and accessibility guidelines",
  robust: "resilient to the specific failure cases listed below",
  seamless: "without requiring the user to re-enter information",
  seamlessly: "without requiring the user to re-enter information",
  reliable: "correct in at least 99% of attempts, measured over a rolling 30 days",
};

const MEASURABLE_FALLBACK = "with a defined, measurable threshold (e.g. under 2 seconds for 95% of attempts)";

const GENERIC_BENEFIT_RE =
  /^(i'?m\s+satisfied|it\s+works|it\s+is\s+better|users?\s+(are|is)\s+happy|i\s+am\s+happy|that'?s\s+it)\.?$/i;

function normalizePersona(rawPersona: string | null | undefined): string {
  const persona = rawPersona?.trim() || "";
  return !persona || persona.toLowerCase() === "user" ? "registered user" : persona;
}

function deVague(text: string): string {
  let result = text;
  for (const [term, replacement] of Object.entries(VAGUE_REPLACEMENTS)) {
    const re = new RegExp(`\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
    if (re.test(result)) result = result.replace(re, replacement);
  }
  return result;
}

/**
 * Splits a clause on top-level "and"s and returns the first segment plus
 * whatever was split off, so a bundled clause like "a settings page and also
 * billing and also notifications" narrows to just the first item instead of
 * silently keeping the whole bundle in the "fixed" story. Used for both the
 * goal and the benefit, since either can arrive bundled.
 */
function splitBundledClause(clause: string): { primary: string; splitOff: string[] } {
  const segments = clause
    .split(/\s*,?\s+and(?:\s+also)?\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);
  if (segments.length <= 1) return { primary: clause, splitOff: [] };
  return { primary: segments[0], splitOff: segments.slice(1) };
}

export function rewriteUserStory(userStory: string): { text: string; rationale: string[] } {
  const parsed = parseUserStory(userStory);
  const rationale: string[] = [];

  const originalPersona = parsed.persona?.trim() || "";
  let goal = parsed.goal?.trim() || "";
  let benefit = parsed.benefit?.trim() || "";

  const persona = normalizePersona(originalPersona);
  if (persona !== originalPersona) {
    rationale.push("Persona is named specifically rather than left as a generic \"user\".");
  } else {
    rationale.push("Persona is specific and preserved from the original story.");
  }

  if (!goal) {
    goal = userStory
      .replace(/^as an?[^,]+,?\s*/i, "")
      .replace(/i\s+(want|need)\s+/i, "")
      .replace(/,?\s*so\s+(that\s+)?.*/i, "")
      .trim();
    if (!goal) goal = "accomplish the intended task";
  }

  const goalSplit = splitBundledClause(goal);
  if (goalSplit.splitOff.length > 0) {
    goal = goalSplit.primary;
    rationale.push(
      `Scope is narrowed to "${goalSplit.primary}" — ${goalSplit.splitOff.map((s) => `"${s}"`).join(", ")} ${
        goalSplit.splitOff.length > 1 ? "were" : "was"
      } split out; each should become its own story so this one is independently testable.`
    );
  } else {
    rationale.push("Scope is limited to a single capability so the story is independently testable.");
  }

  goal = deVague(goal);
  rationale.push("Goal is clearly and concretely defined, avoiding subjective language.");

  if (!benefit) {
    benefit = "I get the outcome I need without unnecessary friction or delay";
    rationale.push('A "so that" clause was added to make the underlying value explicit.');
  } else {
    const benefitSplit = splitBundledClause(benefit);
    let workingBenefit = deVague(benefitSplit.primary);
    let benefitChanged = workingBenefit !== benefitSplit.primary || benefitSplit.splitOff.length > 0;

    if (wordCount(workingBenefit) < 4 || GENERIC_BENEFIT_RE.test(workingBenefit.trim())) {
      workingBenefit = `I get the value described (${workingBenefit}) confirmed clearly, without unnecessary friction or delay`;
      benefitChanged = true;
    }

    benefit = workingBenefit;
    rationale.push(
      benefitChanged
        ? 'User value is stated as a concrete, complete outcome instead of a thin or subjective clause.'
        : "User value is explicit in the \"so that\" clause."
    );
  }

  const text = `As a ${persona}, I want ${goal}, so that ${benefit}.`;
  return { text: capitalize(text), rationale };
}

function ensureMeasurable(text: string): string {
  if (hasMeasurableTerms(text)) return text;
  return `${text.replace(/[.]$/, "")}, ${MEASURABLE_FALLBACK}`;
}

export function rewriteAcceptanceCriteria(
  acceptanceCriteria: string,
  userStory: string
): RewrittenScenario[] {
  const blocks = splitAcceptanceCriteria(acceptanceCriteria);
  const parsed = parseUserStory(userStory);
  const persona = normalizePersona(parsed.persona);

  if (blocks.length === 0 || !acceptanceCriteria.trim()) {
    return [
      {
        title: "Scenario 1 — Happy path",
        given: `I am a ${persona} in a valid starting state`,
        when: `I perform the primary action described in the story`,
        then: ensureMeasurable("the system completes the action and confirms success clearly"),
      },
      {
        title: "Scenario 2 — Invalid input",
        given: `I am a ${persona} providing invalid or incomplete input`,
        when: `I attempt the primary action`,
        then: ensureMeasurable("the system rejects the action and explains what needs to be corrected"),
      },
    ];
  }

  const scenarios = blocks.map((block, i) => {
    const gwt = extractGwt(block);
    const label = block.match(/^scenario[^\n:—-]*[:—-]?\s*(.*)$/i)?.[1]?.trim();
    const title = `Scenario ${i + 1}${label ? ` — ${capitalize(label)}` : ""}`;

    let given: string;
    let when: string;
    let then: string;

    if (isGwtFormat(block)) {
      given = gwt.given ?? `I am a ${persona}`;
      when = gwt.when ?? "I perform the primary action described in the story";
      then = gwt.then ?? "the system responds with a clear, verifiable outcome";
    } else {
      // A plain (non-GWT) criterion is usually stating an expected outcome
      // rather than a trigger — put the (de-vagued) statement in "then"
      // rather than dumping it unchanged into "when".
      given = `I am a ${persona}`;
      when = "I perform the primary action described in the story";
      then = cleanupFreeform(block);
    }

    given = deVague(given);
    when = deVague(when);
    then = ensureMeasurable(deVague(then));

    return {
      title,
      given: capitalize(given),
      when: capitalize(when),
      then: capitalize(then),
    };
  });

  // A single, thin scenario can't demonstrate that the story is testable
  // from more than one angle — add a complementary negative-path scenario
  // rather than leaving "testable" resting on one happy-path example.
  if (scenarios.length === 1) {
    scenarios.push({
      title: "Scenario 2 — Invalid input",
      given: `I am a ${persona} providing invalid or incomplete input`,
      when: "I attempt the primary action",
      then: ensureMeasurable("the system rejects the action and explains what needs to be corrected"),
    });
  }

  return scenarios;
}

function cleanupFreeform(text: string): string {
  return text
    .replace(/^(the system should|it should|should)\s*/i, "")
    .replace(/[.]$/, "")
    .trim();
}

export function findVagueTermCount(text: string): number {
  return findVagueTerms(text).length;
}
