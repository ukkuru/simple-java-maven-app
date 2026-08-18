import type { RewrittenScenario } from "@/types";
import {
  parseUserStory,
  splitAcceptanceCriteria,
  extractGwt,
  isGwtFormat,
  findVagueTerms,
  capitalize,
} from "./textUtils";

const VAGUE_REPLACEMENTS: Record<string, string> = {
  fast: "within an agreed time limit (e.g. under 2 seconds)",
  quickly: "within an agreed time limit",
  easy: "achievable in a small number of clear steps",
  easily: "in a small number of clear steps",
  simple: "with a minimal, clearly defined set of steps",
  intuitive: "consistent with existing navigation patterns",
  "user-friendly": "consistent with existing UX patterns and accessibility guidelines",
  "user friendly": "consistent with existing UX patterns and accessibility guidelines",
  robust: "resilient to the specific failure cases listed below",
  seamless: "without requiring the user to re-enter information",
  seamlessly: "without requiring the user to re-enter information",
  reliable: "available and correct in at least 99% of attempts",
};

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
 * Splits a goal on top-level "and"s and returns the first clause plus
 * whatever was split off, so a bundled goal like "a settings page and also
 * billing and also notifications" narrows to just the first capability
 * instead of silently keeping the whole bundle in the "fixed" story.
 */
function splitBundledGoal(goal: string): { primary: string; splitOff: string[] } {
  const segments = goal
    .split(/\s*,?\s+and(?:\s+also)?\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);
  if (segments.length <= 1) return { primary: goal, splitOff: [] };
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
      .replace(/,?\s*so that.*/i, "")
      .trim();
    if (!goal) goal = "accomplish the intended task";
  }

  const { primary, splitOff } = splitBundledGoal(goal);
  if (splitOff.length > 0) {
    goal = primary;
    rationale.push(
      `Scope is narrowed to "${primary}" — ${splitOff.map((s) => `"${s}"`).join(", ")} ${
        splitOff.length > 1 ? "were" : "was"
      } split out; each should become its own story so this one is independently testable.`
    );
  } else {
    rationale.push("Scope is limited to a single capability so the story is independently testable.");
  }

  goal = deVague(goal);
  rationale.push("Goal is clearly and concretely defined, avoiding subjective language.");

  if (!benefit) {
    benefit = `achieve the intended outcome without unnecessary friction`;
    rationale.push('A "so that" clause was added to make the underlying value explicit.');
  } else {
    const deVaguedBenefit = deVague(benefit);
    if (deVaguedBenefit !== benefit) {
      benefit = deVaguedBenefit;
      rationale.push('User value is stated as a concrete outcome instead of subjective adjectives.');
    } else {
      rationale.push("User value is explicit in the \"so that\" clause.");
    }
  }

  const text = `As a ${persona}, I want ${goal}, so that ${benefit}.`;
  return { text: capitalize(text), rationale };
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
        then: `the system completes the action and confirms success clearly`,
      },
      {
        title: "Scenario 2 — Invalid input",
        given: `I am a ${persona} providing invalid or incomplete input`,
        when: `I attempt the primary action`,
        then: `the system rejects the action and explains what needs to be corrected`,
      },
    ];
  }

  return blocks.map((block, i) => {
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
    then = deVague(then);

    return {
      title,
      given: capitalize(given),
      when: capitalize(when),
      then: capitalize(then),
    };
  });
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
