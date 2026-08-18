import type { CriterionStatus, Framework } from "@/types";

/**
 * Central place for scoring weights and thresholds so nothing is hard-coded
 * throughout the UI. Weights are relative and normalized at calculation time,
 * so they don't need to sum to 100 — see lib/scoring/engine.ts.
 */

export interface CriterionDefinition {
  key: string;
  name: string;
  weight: number;
  description: string;
}

export const SMART_CRITERIA: CriterionDefinition[] = [
  {
    key: "specific",
    name: "Specific",
    weight: 25,
    description:
      "The persona, capability, and desired outcome are clear and unambiguous.",
  },
  {
    key: "measurable",
    name: "Measurable",
    weight: 20,
    description:
      "Success can be objectively evaluated using measurable or verifiable conditions.",
  },
  {
    key: "achievable",
    name: "Achievable",
    weight: 15,
    description:
      "The functionality is realistic in scope and technically or operationally feasible.",
  },
  {
    key: "relevant",
    name: "Relevant",
    weight: 25,
    description:
      "The story delivers clear user or business value aligned with its stated goal.",
  },
  {
    key: "timeBound",
    name: "Time-bound",
    weight: 15,
    description:
      "A timeframe is present where relevant, and not forced where it doesn't belong.",
  },
];

export const INVEST_CRITERIA: CriterionDefinition[] = [
  {
    key: "independent",
    name: "Independent",
    weight: 15,
    description:
      "The story can be implemented and delivered with minimal dependency on other stories.",
  },
  {
    key: "negotiable",
    name: "Negotiable",
    weight: 10,
    description:
      "The story describes a desired outcome rather than prescribing an overly specific implementation.",
  },
  {
    key: "valuable",
    name: "Valuable",
    weight: 25,
    description: "The story provides clear value to the user or business.",
  },
  {
    key: "estimable",
    name: "Estimable",
    weight: 15,
    description:
      "The requirement is clear enough for a development team to estimate effort.",
  },
  {
    key: "small",
    name: "Small",
    weight: 15,
    description: "The story is appropriately sized for a single sprint or iteration.",
  },
  {
    key: "testable",
    name: "Testable",
    weight: 20,
    description:
      "Acceptance criteria can objectively determine whether the story is complete.",
  },
];

export function getCriteriaForFramework(framework: Framework): CriterionDefinition[] {
  return framework === "SMART" ? SMART_CRITERIA : INVEST_CRITERIA;
}

export const SCORE_BANDS: { min: number; max: number; label: string }[] = [
  { min: 90, max: 100, label: "Excellent" },
  { min: 80, max: 89, label: "Good" },
  { min: 70, max: 79, label: "Needs Improvement" },
  { min: 50, max: 69, label: "Weak" },
  { min: 0, max: 49, label: "Poor" },
];

export function getScoreLabel(score: number): string {
  const band = SCORE_BANDS.find((b) => score >= b.min && score <= b.max);
  return band?.label ?? "Unscored";
}

export const STATUS_THRESHOLDS: { min: number; status: CriterionStatus }[] = [
  { min: 85, status: "strong" },
  { min: 70, status: "good" },
  { min: 50, status: "needs_improvement" },
  { min: 0, status: "poor" },
];

export function getStatusForScore(score: number | null): CriterionStatus {
  if (score === null) return "not_applicable";
  const match = STATUS_THRESHOLDS.find((t) => score >= t.min);
  return match?.status ?? "poor";
}

export const SCORING_EXPLANATION =
  "Overall Score = weighted average of each applicable framework criterion's score, " +
  "using the configured weight for that criterion. Criteria marked Not Applicable " +
  "(for example, Time-bound when no timing constraint is relevant) are excluded from " +
  "the calculation and their weight is redistributed proportionally across the remaining criteria.";
