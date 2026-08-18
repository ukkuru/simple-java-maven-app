import { describe, it, expect } from "vitest";
import { rewriteUserStory, rewriteAcceptanceCriteria } from "@/lib/analysis/rewrite";

describe("rewriteUserStory — actually resolves the issues it identifies", () => {
  it("splits a bundled goal down to a single capability instead of keeping the whole 'and' chain", () => {
    const { text, rationale } = rewriteUserStory(
      "As a user I want a settings page and also billing and also team management and notifications so that the app is easy and user-friendly and fast."
    );
    expect(text).not.toMatch(/billing/i);
    expect(text).not.toMatch(/team management/i);
    expect(text).not.toMatch(/notifications/i);
    expect(text.toLowerCase()).toContain("settings page");
    expect(rationale.some((r) => /split out/i.test(r))).toBe(true);
  });

  it("de-vagues the benefit clause, not just the goal", () => {
    const { text } = rewriteUserStory(
      "As a user, I want to export a report, so that it is easy and fast and user-friendly."
    );
    expect(text.toLowerCase()).not.toContain("easy and fast");
    expect(text).not.toMatch(/\buser-friendly\b/i);
  });

  it("replaces a generic 'user' persona with something more specific", () => {
    const { text } = rewriteUserStory("As a user, I want to export a report, so that I can share it.");
    expect(text).not.toMatch(/as a user\b/i);
    expect(text.toLowerCase()).toContain("registered user");
  });

  it("keeps a specific persona unchanged", () => {
    const { text } = rewriteUserStory(
      "As a warehouse manager, I want to reorder low-stock items automatically, so that shelves are never empty."
    );
    expect(text.toLowerCase()).toContain("warehouse manager");
  });

  it("never produces 'I want to <noun phrase>' or drops 'to' from a verb phrase", () => {
    const noun = rewriteUserStory("As a user, I want a settings page, so that I can configure the app.");
    expect(noun.text).not.toMatch(/i want to a\b/i);

    const verb = rewriteUserStory(
      "As a customer, I want to reset my password, so that I can regain access to my account."
    );
    expect(verb.text.toLowerCase()).toContain("i want to reset");
  });

  it("never leaves double punctuation at the end of the sentence", () => {
    const { text } = rewriteUserStory(
      "As a customer, I want to update my profile, so that my information stays current."
    );
    expect(text).not.toMatch(/\.\./);
  });
});

describe("rewriteAcceptanceCriteria — actually resolves the issues it identifies", () => {
  it("de-vagues a plain-language criterion instead of leaving it untouched", () => {
    const scenarios = rewriteAcceptanceCriteria(
      "The settings page should work well and be intuitive.",
      "As a user, I want a settings page, so that I can configure the app."
    );
    const joined = JSON.stringify(scenarios).toLowerCase();
    expect(joined).not.toContain("intuitive");
  });

  it("puts a plain (non-GWT) criterion's content in 'then', not verbatim in 'when'", () => {
    const scenarios = rewriteAcceptanceCriteria(
      "Export should work correctly.",
      "As a user, I want to export data, so that I can use it elsewhere."
    );
    expect(scenarios[0].when).not.toMatch(/export should work correctly/i);
    expect(scenarios[0].then.toLowerCase()).toContain("work correctly");
  });

  it("uses the same normalized persona as the rewritten user story", () => {
    const userStory = "As a user, I want to export a report, so that I can share it.";
    const { text } = rewriteUserStory(userStory);
    const scenarios = rewriteAcceptanceCriteria("Export should work.", userStory);
    expect(text.toLowerCase()).toContain("registered user");
    expect(scenarios[0].given.toLowerCase()).toContain("registered user");
  });

  it("preserves an already well-formed Given/When/Then scenario's structure", () => {
    const scenarios = rewriteAcceptanceCriteria(
      "Given I am a registered customer\nWhen I request a password reset\nThen the system sends a reset email within 2 minutes",
      "As a registered customer, I want to reset my password, so that I can regain access to my account."
    );
    expect(scenarios).toHaveLength(1);
    expect(scenarios[0].given.toLowerCase()).toContain("registered customer");
    expect(scenarios[0].when.toLowerCase()).toContain("password reset");
    expect(scenarios[0].then.toLowerCase()).toContain("reset email");
  });
});
