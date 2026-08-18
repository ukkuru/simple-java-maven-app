import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ShieldAlert } from "lucide-react";
import { authOptions } from "@/lib/auth/options";
import { isAdminEmail } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  if (!isAdminEmail(session.user.email)) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mb-4 flex justify-center">
          <ShieldAlert className="h-10 w-10 text-danger-500" />
        </div>
        <h1 className="text-xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">
          This page is restricted to administrators. If you believe this is a mistake, ask an
          existing admin to add your email to <code>ADMIN_EMAILS</code>.
        </p>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      marketingOptIn: true,
      createdAt: true,
      lastLoginAt: true,
      accounts: { select: { provider: true } },
      _count: { select: { analyses: true } },
    },
  });

  const totalUsers = users.length;
  const marketingOptedIn = users.filter((u) => u.marketingOptIn).length;
  const activeLast7Days = users.filter(
    (u) => u.lastLoginAt && Date.now() - u.lastLoginAt.getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
          Everyone who has registered or signed in — visible only to admins.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-xs text-[rgb(var(--text-muted))]">Total users</p>
            <p className="text-xl font-bold tabular-nums">{totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-[rgb(var(--text-muted))]">Opted into marketing email</p>
            <p className="text-xl font-bold tabular-nums">{marketingOptedIn}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-[rgb(var(--text-muted))]">Active in last 7 days</p>
            <p className="text-xl font-bold tabular-nums">{activeLast7Days}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[rgb(var(--surface-2))] text-left text-xs uppercase tracking-wide text-[rgb(var(--text-muted))]">
              <tr>
                <th className="whitespace-nowrap px-4 py-3">User</th>
                <th className="whitespace-nowrap px-4 py-3">Sign-in method</th>
                <th className="whitespace-nowrap px-4 py-3">Marketing</th>
                <th className="whitespace-nowrap px-4 py-3">Analyses</th>
                <th className="whitespace-nowrap px-4 py-3">Registered</th>
                <th className="whitespace-nowrap px-4 py-3">Last login</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const providers = Array.from(new Set(u.accounts.map((a) => a.provider)));
                const methods = [...(u.passwordHash ? ["Email"] : []), ...providers.map(capitalize)];
                return (
                  <tr key={u.id} className="border-t border-[rgb(var(--border))]">
                    <td className="px-4 py-3">
                      <p className="font-medium">{u.name || "—"}</p>
                      <p className="text-xs text-[rgb(var(--text-muted))]">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {methods.length > 0 ? (
                          methods.map((m) => (
                            <Badge key={m} tone="neutral">
                              {m}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-[rgb(var(--text-muted))]">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={u.marketingOptIn ? "success" : "neutral"}>
                        {u.marketingOptIn ? "Opted in" : "Opted out"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{u._count.analyses}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-[rgb(var(--text-muted))]">
                      {formatDate(u.createdAt.toISOString())}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[rgb(var(--text-muted))]">
                      {u.lastLoginAt ? formatDate(u.lastLoginAt.toISOString()) : "Never"}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[rgb(var(--text-muted))]">
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
