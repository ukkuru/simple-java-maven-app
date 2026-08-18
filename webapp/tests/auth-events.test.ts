import { describe, it, expect, vi, beforeEach } from "vitest";

const updateMock = vi.fn();

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: { update: (...args: unknown[]) => updateMock(...args) },
  },
}));

describe("NextAuth events — marketing opt-in defaults and login tracking", () => {
  beforeEach(() => {
    updateMock.mockClear();
  });

  it("opts a newly-created (OAuth) user into marketing by default", async () => {
    const { authOptions } = await import("@/lib/auth/options");
    await authOptions.events?.createUser?.({ user: { id: "user-1" } } as never);

    expect(updateMock).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { marketingOptIn: true },
    });
  });

  it("does not touch marketingOptIn on sign-in, only lastLoginAt", async () => {
    const { authOptions } = await import("@/lib/auth/options");
    await authOptions.events?.signIn?.({ user: { id: "user-1" } } as never);

    expect(updateMock).toHaveBeenCalledTimes(1);
    const call = updateMock.mock.calls[0][0];
    expect(call.where).toEqual({ id: "user-1" });
    expect(call.data).toHaveProperty("lastLoginAt");
    expect(call.data).not.toHaveProperty("marketingOptIn");
  });
});
