import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingToggle } from "@/components/auth/marketing-toggle";
import { SMART_CRITERIA, INVEST_CRITERIA, SCORE_BANDS, SCORING_EXPLANATION } from "@/lib/scoring/config";

export const dynamic = "force-dynamic";

function WeightTable({ title, criteria }: { title: string; criteria: { name: string; weight: number; description: string }[] }) {
  const total = criteria.reduce((s, c) => s + c.weight, 0);
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <div className="overflow-hidden rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-sm">
          <thead className="bg-[rgb(var(--surface-2))] text-left text-xs uppercase tracking-wide text-[rgb(var(--text-muted))]">
            <tr>
              <th className="px-3 py-2">Criterion</th>
              <th className="px-3 py-2">Weight</th>
              <th className="px-3 py-2">Normalized</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((c) => (
              <tr key={c.name} className="border-t border-[rgb(var(--border))]">
                <td className="px-3 py-2 font-medium">{c.name}</td>
                <td className="px-3 py-2 tabular-nums">{c.weight}</td>
                <td className="px-3 py-2 tabular-nums text-[rgb(var(--text-muted))]">
                  {Math.round((c.weight / total) * 100)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, name: true, marketingOptIn: true, passwordHash: true },
  });

  const provider = (process.env.AI_PROVIDER || "heuristic").toLowerCase();
  const model = process.env.AI_MODEL || "(default)";
  const configured = provider === "heuristic" || Boolean(process.env.AI_API_KEY);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
          Account, analysis engine configuration, and scoring methodology.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your sign-in details and communication preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[rgb(var(--text-muted))]">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[rgb(var(--text-muted))]">Sign-in method</span>
            <Badge tone="neutral">{user?.passwordHash ? "Email and password" : "Google"}</Badge>
          </div>
          <div className="my-1 h-px bg-[rgb(var(--border))]" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Marketing emails</p>
              <p className="text-xs text-[rgb(var(--text-muted))]">
                Product updates and marketing communications from Testmetry.com, sent to your
                account email address.
              </p>
            </div>
            <MarketingToggle initialValue={user?.marketingOptIn ?? false} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Provider</CardTitle>
          <CardDescription>
            Configured via environment variables (AI_PROVIDER, AI_API_KEY, AI_MODEL). API keys are never exposed to the
            browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[rgb(var(--text-muted))]">Provider</span>
            <Badge tone="brand">{provider}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[rgb(var(--text-muted))]">Model</span>
            <span className="font-medium">{provider === "heuristic" ? "Built-in rule engine" : model}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[rgb(var(--text-muted))]">Status</span>
            <Badge tone={configured ? "success" : "danger"}>{configured ? "Ready" : "Missing API key"}</Badge>
          </div>
          <p className="pt-2 text-xs text-[rgb(var(--text-muted))]">
            The heuristic provider requires no API key and always works. Set AI_PROVIDER=anthropic and AI_API_KEY to use
            an LLM instead — the app talks to it through the same AnalysisProvider interface, so no UI code changes are
            needed.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scoring Methodology</CardTitle>
          <CardDescription>{SCORING_EXPLANATION}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <WeightTable title="SMART weights" criteria={SMART_CRITERIA} />
          <WeightTable title="INVEST weights" criteria={INVEST_CRITERIA} />

          <div>
            <p className="mb-2 text-sm font-semibold">Score bands</p>
            <ul className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
              {SCORE_BANDS.map((b) => (
                <li key={b.label} className="rounded-lg border border-[rgb(var(--border))] px-3 py-2">
                  <span className="font-medium">{b.min}–{b.max}</span>
                  <span className="block text-xs text-[rgb(var(--text-muted))]">{b.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
