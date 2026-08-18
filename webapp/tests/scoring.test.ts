import { describe, it, expect } from "vitest";
import { computeOverallScore, clampScore, scoreLabelWithBand } from "@/lib/scoring/engine";
import { getScoreLabel, getStatusForScore } from "@/lib/scoring/config";
import type { CriterionResult } from "@/types";

function criterion(overrides: Partial<CriterionResult>): CriterionResult {
  return {
    key: "x",
    name: "X",
    score: 80,
    weight: 10,
    status: "good",
    assessment: "",
    issues: [],
    recommendations: [],
    applicable: true,
    ...overrides,
  };
}

describe("computeOverallScore", () => {
  it("computes a simple weighted average", () => {
    const criteria = [
      criterion({ key: "a", score: 100, weight: 50 }),
      criterion({ key: "b", score: 0, weight: 50 }),
    ];
    expect(computeOverallScore(criteria)).toBe(50);
  });

  it("weights criteria proportionally, not evenly", () => {
    const criteria = [
      criterion({ key: "a", score: 100, weight: 80 }),
      criterion({ key: "b", score: 0, weight: 20 }),
    ];
    expect(computeOverallScore(criteria)).toBe(80);
  });

  it("excludes not-applicable criteria and redistributes weight", () => {
    const criteria = [
      criterion({ key: "a", score: 100, weight: 50 }),
      criterion({ key: "b", score: null, weight: 50, applicable: false, status: "not_applicable" }),
    ];
    // Only "a" counts, so the average is just a's score.
    expect(computeOverallScore(criteria)).toBe(100);
  });

  it("returns 0 when there are no applicable criteria", () => {
    const criteria = [
      criterion({ key: "a", score: null, weight: 50, applicable: false, status: "not_applicable" }),
    ];
    expect(computeOverallScore(criteria)).toBe(0);
  });

  it("returns 0 for an empty criteria list", () => {
    expect(computeOverallScore([])).toBe(0);
  });

  it("rounds to the nearest integer", () => {
    const criteria = [
      criterion({ key: "a", score: 100, weight: 1 }),
      criterion({ key: "b", score: 0, weight: 2 }),
    ];
    // (100*1 + 0*2) / 3 = 33.33... -> 33
    expect(computeOverallScore(criteria)).toBe(33);
  });
});

describe("clampScore", () => {
  it("clamps below 0 to 0", () => {
    expect(clampScore(-15)).toBe(0);
  });
  it("clamps above 100 to 100", () => {
    expect(clampScore(140)).toBe(100);
  });
  it("rounds fractional scores", () => {
    expect(clampScore(72.6)).toBe(73);
  });
});

describe("score bands / labels", () => {
  it.each([
    [100, "Excellent"],
    [90, "Excellent"],
    [89, "Good"],
    [80, "Good"],
    [79, "Needs Improvement"],
    [70, "Needs Improvement"],
    [69, "Weak"],
    [50, "Weak"],
    [49, "Poor"],
    [0, "Poor"],
  ])("labels score %i as %s", (score, label) => {
    expect(getScoreLabel(score)).toBe(label);
    expect(scoreLabelWithBand(score)).toBe(label);
  });
});

describe("status thresholds", () => {
  it("maps null score to not_applicable", () => {
    expect(getStatusForScore(null)).toBe("not_applicable");
  });
  it.each([
    [85, "strong"],
    [100, "strong"],
    [70, "good"],
    [84, "good"],
    [50, "needs_improvement"],
    [69, "needs_improvement"],
    [0, "poor"],
    [49, "poor"],
  ])("maps score %i to status %s", (score, status) => {
    expect(getStatusForScore(score)).toBe(status);
  });
});
