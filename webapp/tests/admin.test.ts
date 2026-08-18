import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isAdminEmail } from "@/lib/auth/admin";

describe("isAdminEmail", () => {
  const original = process.env.ADMIN_EMAILS;

  afterEach(() => {
    process.env.ADMIN_EMAILS = original;
  });

  it("returns false when ADMIN_EMAILS is unset", () => {
    delete process.env.ADMIN_EMAILS;
    expect(isAdminEmail("owner@testmetry.com")).toBe(false);
  });

  it("returns false for null/undefined email", () => {
    process.env.ADMIN_EMAILS = "owner@testmetry.com";
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it("matches an email in a single-entry allowlist", () => {
    process.env.ADMIN_EMAILS = "owner@testmetry.com";
    expect(isAdminEmail("owner@testmetry.com")).toBe(true);
  });

  it("matches case-insensitively", () => {
    process.env.ADMIN_EMAILS = "Owner@Testmetry.com";
    expect(isAdminEmail("owner@testmetry.com")).toBe(true);
    expect(isAdminEmail("OWNER@TESTMETRY.COM")).toBe(true);
  });

  it("supports a comma-separated list with whitespace", () => {
    process.env.ADMIN_EMAILS = "a@testmetry.com, b@testmetry.com ,c@testmetry.com";
    expect(isAdminEmail("b@testmetry.com")).toBe(true);
    expect(isAdminEmail("c@testmetry.com")).toBe(true);
  });

  it("rejects an email not in the allowlist", () => {
    process.env.ADMIN_EMAILS = "owner@testmetry.com";
    expect(isAdminEmail("someone-else@testmetry.com")).toBe(false);
  });
});
