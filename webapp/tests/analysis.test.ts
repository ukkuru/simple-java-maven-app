import { describe, it, expect } from "vitest";
import { runHeuristicAnalysis } from "@/lib/analysis";
import { evaluateSmart } from "@/lib/analysis/smart";
import { evaluateInvest } from "@/lib/analysis/invest";
import { DEMO_EXAMPLES } from "@/lib/data/examples";

describe("runHeuristicAnalysis", () => {
  it("returns a schema-shaped result for INVEST", () => {
    const result = runHeuristicAnalysis(
      "As a registered customer, I want to reset my password using my verified email, so that I can regain access to my account.",
      "Given I am a registered customer\nWhen I request a password reset\nThen I receive an email within 2 minutes",
      "INVEST"
    );
    expect(result.framework).toBe("INVEST");
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.criteria.length).toBe(6);
    expect(result.rewrittenUserStory).toContain("As a");
    expect(result.rewrittenAcceptanceCriteria.length).toBeGreaterThan(0);
  });

  it("returns a schema-shaped result for SMART", () => {
    const result = runHeuristicAnalysis(
      "As a shopper, I want to filter results, so that I find products faster.",
      "Given results are shown\nWhen I filter by price\nThen only matching results remain",
      "SMART"
    );
    expect(result.framework).toBe("SMART");
    expect(result.criteria.length).toBe(5);
  });

  it("treats Time-bound as not applicable when no timing signal is present", () => {
    const result = runHeuristicAnalysis(
      "As a shopper, I want to filter results by category, so that I find products faster.",
      "Given results are shown\nWhen I filter by category\nThen only matching results remain",
      "SMART"
    );
    const timeBound = result.criteria.find((c) => c.key === "timeBound");
    expect(timeBound?.applicable).toBe(false);
    expect(timeBound?.score).toBeNull();
    expect(timeBound?.status).toBe("not_applicable");
  });

  it("marks Time-bound applicable when a deadline or expiry is referenced", () => {
    const result = runHeuristicAnalysis(
      "As a customer, I want my password reset link to expire, so that my account stays secure.",
      "Given my reset link is older than 30 minutes\nWhen I open it\nThen it should be expired",
      "SMART"
    );
    const timeBound = result.criteria.find((c) => c.key === "timeBound");
    expect(timeBound?.applicable).toBe(true);
  });

  it("handles empty acceptance criteria gracefully without throwing", () => {
    expect(() =>
      runHeuristicAnalysis("As a user, I want to do something, so that it helps.", "", "INVEST")
    ).not.toThrow();
    const result = runHeuristicAnalysis("As a user, I want to do something, so that it helps.", "", "INVEST");
    const testable = result.criteria.find((c) => c.key === "testable");
    expect(testable?.score).toBeLessThan(50);
    expect(testable?.issues.length).toBeGreaterThan(0);
  });

  it("produces a grammatically well-formed rewritten story (no missing 'to', no double punctuation)", () => {
    const result = runHeuristicAnalysis(
      "As a registered customer, I want to reset my password using my verified email address, so that I can regain access to my account without contacting support.",
      "Given I am a registered customer\nWhen I request a password reset\nThen I receive an email",
      "INVEST"
    );
    expect(result.rewrittenUserStory).toMatch(/i want to \w/i);
    expect(result.rewrittenUserStory).not.toMatch(/\.\./);
  });

  it("preserves the original persona and benefit intent when rewriting", () => {
    const result = runHeuristicAnalysis(
      "As a warehouse manager, I want to reorder low-stock items automatically, so that shelves are never empty.",
      "Given stock falls below threshold\nWhen the nightly job runs\nThen a reorder is placed",
      "INVEST"
    );
    expect(result.rewrittenUserStory.toLowerCase()).toContain("warehouse manager");
    expect(result.rewrittenUserStory.toLowerCase()).toContain("reorder");
  });

  it("scores demo examples in roughly descending quality order", () => {
    const scores = DEMO_EXAMPLES.map((e) => ({
      quality: e.quality,
      score: runHeuristicAnalysis(e.userStory, e.acceptanceCriteria, "INVEST").overallScore,
    }));
    const byId = Object.fromEntries(scores.map((s) => [s.quality, s.score]));
    expect(byId.excellent).toBeGreaterThan(byId.very_poor);
    expect(byId.good).toBeGreaterThan(byId.very_poor);
    expect(byId.excellent).toBeGreaterThan(byId.poor);
    expect(byId.good).toBeGreaterThan(byId.poor);
    expect(byId.excellent).toBeGreaterThanOrEqual(byId.good);
    expect(byId.average).toBeGreaterThan(byId.very_poor);
  });
});

describe("evaluateInvest — Small criterion", () => {
  it("penalizes stories that bundle multiple capabilities with 'and' chains", () => {
    const bundled = evaluateInvest(
      "As a user I want a settings page and also billing and also team management and notifications so that it is easy.",
      "The settings page should work well."
    );
    const small = bundled.find((c) => c.key === "small");
    expect(small?.score).toBeLessThan(60);
    expect(small?.issues.length).toBeGreaterThan(0);
  });
});

describe("evaluateSmart — Specific criterion", () => {
  it("flags vague terminology", () => {
    const result = evaluateSmart(
      "As a user, I want the app to be fast and easy and user-friendly, so that it's good.",
      ""
    );
    const specific = result.find((c) => c.key === "specific");
    expect(specific?.issues.some((i) => i.toLowerCase().includes("vague"))).toBe(true);
  });
});
