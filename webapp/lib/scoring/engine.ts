import type { CriterionResult } from "@/types";
import { getScoreLabel } from "./config";

/**
 * Computes the weighted-average overall score from per-criterion results.
 * Not-applicable criteria are excluded and their weight redistributed
 * proportionally across the remaining, applicable criteria.
 */
export function computeOverallScore(criteria: CriterionResult[]): number {
  const applicable = criteria.filter((c) => c.applicable && c.score !== null);
  const totalWeight = applicable.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight === 0 || applicable.length === 0) return 0;

  const weightedSum = applicable.reduce(
    (sum, c) => sum + (c.score as number) * c.weight,
    0
  );
  return Math.round(weightedSum / totalWeight);
}

export function scoreLabelWithBand(score: number): string {
  return getScoreLabel(score);
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}
