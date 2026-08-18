import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "@/lib/validation/auth";

describe("registerSchema", () => {
  const base = {
    email: "person@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  it("accepts a valid registration", () => {
    const result = registerSchema.safeParse(base);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.marketingOptIn).toBe(false);
    }
  });

  it("defaults marketingOptIn to false when omitted", () => {
    const result = registerSchema.safeParse(base);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.marketingOptIn).toBe(false);
  });

  it("respects an explicit marketingOptIn: true", () => {
    const result = registerSchema.safeParse({ ...base, marketingOptIn: true });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.marketingOptIn).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({ ...base, confirmPassword: "different123" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
    }
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({ ...base, password: "short", confirmPassword: "short" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = registerSchema.safeParse({ ...base, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("lowercases the email address", () => {
    const result = registerSchema.safeParse({ ...base, email: "Person@Example.COM" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("person@example.com");
  });
});

describe("loginSchema", () => {
  it("accepts a valid login", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });

  it("rejects an empty password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(loginSchema.safeParse({ email: "not-an-email", password: "x" }).success).toBe(false);
  });
});
