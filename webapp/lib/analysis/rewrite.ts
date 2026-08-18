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

export function rewriteUserStory(userStory: string): { text: string; rationale: string[] } {
  const parsed = parseUserStory(userStory);
  const rationale: string[] = [];

  let persona = parsed.persona?.trim() || "";
  let goal = parsed.goal?.trim() || "";
  let benefit = parsed.benefit?.trim() || "";

  if (!persona || persona.toLowerCase() === "user") {
    persona = persona || "registered user";
    rationale.push("Persona is named specifically rather than left as a generic \"user\".");
  } else {
    rationale.push("Persona is specific and preserved from the original story.");
  }

  if (!goal) {
    goal = userStory
      .replace(/^as an?[^,]+,?\s*/i, "")
      .replace(/i\s+(want|need)\s+(to\s+)?/i, "")
      .replace(/,?\s*so that.*/i, "")
      .trim();
    if (!goal) goal = "accomplish the intended task";
  }
  // De-vague the goal text.
  for (const [term, replacement] of Object.entries(VAGUE_REPLACEMENTS)) {
    const re = new RegExp(`\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
    if (re.test(goal)) {
      goal = goal.replace(re, replacement);
    }
  }
  rationale.push("Goal is clearly and concretely defined, avoiding subjective language.");

  if (!benefit) {
    benefit = `achieve the intended outcome without unnecessary friction`;
    rationale.push('A "so that" clause was added to make the underlying value explicit.');
  } else {
    rationale.push("User value is explicit in the \"so that\" clause.");
  }

  rationale.push("Scope is limited to a single capability so the story is independently testable.");

  const goalPhrase = /^to\s/i.test(goal) ? goal : `to ${goal}`;
  const text = `As a ${persona}, I want ${goalPhrase}, so that ${benefit}.`;
  return { text: capitalize(text), rationale };
}

export function rewriteAcceptanceCriteria(
  acceptanceCriteria: string,
  userStory: string
): RewrittenScenario[] {
  const blocks = splitAcceptanceCriteria(acceptanceCriteria);
  const parsed = parseUserStory(userStory);
  const persona = parsed.persona?.trim() || "user";

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

    let given = gwt.given ?? `I am a ${persona}`;
    let when = gwt.when ?? cleanupFreeform(block);
    let then = gwt.then ?? "the system responds with a clear, verifiable outcome";

    for (const [term, replacement] of Object.entries(VAGUE_REPLACEMENTS)) {
      const re = new RegExp(`\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
      if (re.test(then)) then = then.replace(re, replacement);
      if (re.test(when)) when = when.replace(re, replacement);
    }

    if (!isGwtFormat(block)) {
      // Best-effort conversion of a plain bullet into Given/When/Then.
      when = cleanupFreeform(block);
    }

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
