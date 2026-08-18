export interface ParsedUserStory {
  raw: string;
  persona: string | null;
  goal: string | null;
  benefit: string | null;
  matchesStandardForm: boolean;
}

// Deliberately does NOT special-case an optional "to" after want/need: whether
// "to" is present changes the correct grammar for reusing the captured goal
// elsewhere ("I want to reset..." vs "I want a settings page..."), so it's
// kept as part of the goal capture rather than stripped and re-added later.
// "so that" is the canonical divider, but "so I can ..." (without "that") is
// common enough in real-world stories that treating it as goal text instead
// of a value clause was swallowing the entire benefit into the goal.
const STANDARD_FORM_RE =
  /as\s+an?\s+(.+?),?\s+i\s+(?:want|need|would like)\s+(.+?)(?:,?\s+so\s+(?:that\s+)?(.+))?$/is;

export function parseUserStory(text: string): ParsedUserStory {
  const raw = text.trim();
  const match = raw.match(STANDARD_FORM_RE);
  if (!match) {
    return { raw, persona: null, goal: null, benefit: null, matchesStandardForm: false };
  }
  const [, persona, goal, benefit] = match;
  return {
    raw,
    persona: persona?.trim().replace(/[.!?]+$/, "").trim() || null,
    // No further "so"-stripping here: the regex's lazy goal capture plus the
    // optional trailing so-clause group already separates goal from benefit
    // correctly. An earlier version re-stripped "so" with a zero-width
    // \s* before it, which matched "so" as a bare substring inside words
    // like "al-so" and silently truncated the goal mid-word.
    goal: goal?.trim().replace(/[.!?]+$/, "").trim() || null,
    benefit: benefit?.trim().replace(/[.!?]+$/, "").trim() || null,
    matchesStandardForm: true,
  };
}

export const VAGUE_TERMS = [
  "fast",
  "quickly",
  "easy",
  "easily",
  "user-friendly",
  "user friendly",
  "simple",
  "intuitive",
  "efficient",
  "efficiently",
  "robust",
  "seamless",
  "seamlessly",
  "responsive",
  "modern",
  "flexible",
  "scalable",
  "reliable",
  "convenient",
  "smooth",
  "quick",
  "good",
  "better",
  "nice",
  "appropriate",
  "reasonable",
  "as needed",
  "etc",
  "and so on",
  "some",
  "various",
  "several",
];

export function findVagueTerms(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const term of VAGUE_TERMS) {
    const re = new RegExp(`\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
    if (re.test(lower)) found.add(term);
  }
  return Array.from(found);
}

const MEASURABLE_RE =
  /(\d+(\.\d+)?\s*(%|percent|ms|milliseconds?|seconds?|secs?|minutes?|mins?|hours?|days?|times?|users?|requests?|records?|items?|characters?|chars?))/i;

export function hasMeasurableTerms(text: string): boolean {
  return MEASURABLE_RE.test(text);
}

export interface GwtScenario {
  given: string | null;
  when: string | null;
  then: string | null;
  raw: string;
}

export function splitAcceptanceCriteria(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  // Try splitting on "Scenario" blocks or blank lines first.
  const scenarioBlocks = trimmed
    .split(/\n\s*\n|(?=^\s*scenario\b)/gim)
    .map((s) => s.trim())
    .filter(Boolean);
  if (scenarioBlocks.length > 1) return scenarioBlocks;

  // A single Given/When/Then scenario spread across lines (no blank-line
  // separator) is one criterion, not one criterion per line.
  if (isGwtFormat(trimmed)) return [trimmed];

  // Fall back to line-based bullet/numbered splitting.
  const lines = trimmed
    .split(/\n/)
    .map((l) => l.replace(/^\s*(\d+[.)]|[-*•])\s*/, "").trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : [trimmed];
}

export function extractGwt(block: string): GwtScenario {
  const givenMatch = block.match(/given\s+(.+?)(?=\bwhen\b|\bthen\b|\band\b\s+when|$)/is);
  const whenMatch = block.match(/when\s+(.+?)(?=\bthen\b|$)/is);
  const thenMatch = block.match(/then\s+(.+)$/is);
  return {
    given: givenMatch?.[1]?.trim().replace(/[,.]$/, "") || null,
    when: whenMatch?.[1]?.trim().replace(/[,.]$/, "") || null,
    then: thenMatch?.[1]?.trim().replace(/[,.]$/, "") || null,
    raw: block.trim(),
  };
}

export function isGwtFormat(text: string): boolean {
  return /\bgiven\b/i.test(text) && /\bwhen\b/i.test(text) && /\bthen\b/i.test(text);
}

export function countGwtScenarios(text: string): number {
  const blocks = splitAcceptanceCriteria(text);
  return blocks.filter((b) => isGwtFormat(b)).length;
}

const PERSONA_KEYWORDS = [
  "user",
  "customer",
  "admin",
  "administrator",
  "manager",
  "guest",
  "visitor",
  "member",
  "operator",
  "developer",
  "analyst",
  "owner",
  "employee",
  "agent",
  "subscriber",
];

export function detectMultiplePersonas(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const kw of PERSONA_KEYWORDS) {
    const re = new RegExp(`\\b(?:a|an|the)\\s+${kw}\\b`, "gi");
    if (re.test(lower)) found.add(kw);
  }
  return Array.from(found);
}

/**
 * Counts top-level "and" chains joining independent capabilities in the goal
 * clause, a common signal of bundled scope (e.g. "I want to create an account
 * and manage my profile and set notification preferences").
 */
export function countAndChains(goalText: string): number {
  const matches = goalText.match(/\band\b/gi);
  return matches ? matches.length : 0;
}

export function countVerbPhrases(goalText: string): number {
  // crude split on " and " / commas followed by a verb-like word
  const parts = goalText
    .split(/,|\band\b/i)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length;
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const DEPENDENCY_KEYWORDS = [
  "existing",
  "depends on",
  "dependent on",
  "requires the",
  "after the",
  "once the",
  "integrat",
  "third-party",
  "third party",
  "legacy",
  "migrat",
];

export function findDependencyHints(text: string): string[] {
  const lower = text.toLowerCase();
  return DEPENDENCY_KEYWORDS.filter((kw) => lower.includes(kw));
}

const TIME_KEYWORDS = [
  "deadline",
  "by end of",
  "within",
  "by q1",
  "by q2",
  "by q3",
  "by q4",
  "by monday",
  "by friday",
  "sprint",
  "release",
  "launch date",
  "due date",
  "before ",
  "no later than",
];

export function findTimeReferences(text: string): string[] {
  const lower = text.toLowerCase();
  return TIME_KEYWORDS.filter((kw) => lower.includes(kw));
}

export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
