import Link from "next/link";
import { FileText, Gauge, TrendingUp, Sparkles } from "lucide-react";
import { listAnalyses } from "@/lib/db/history";
import { buttonVariants } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { HistoryList } from "@/components/dashboard/history-list";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const records = await listAnalyses(100);

  if (records.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Is your user story actually ready for development?
        </h1>
        <p className="mt-3 text-[rgb(var(--text-muted))]">
          Analyze your User Story and Acceptance Criteria against SMART or INVEST and get
          actionable recommendations in seconds.
        </p>
        <Link href="/analyze" className={buttonVariants({ size: "lg", className: "mt-7" })}>
          <Sparkles className="h-4 w-4" /> Analyze My User Story
        </Link>
      </div>
    );
  }

  const avgScore = Math.round(records.reduce((sum, r) => sum + r.overallScore, 0) / records.length);
  const improved = records.filter((r) => typeof r.previousScore === "number" && r.overallScore > r.previousScore!);
  const avgImprovement =
    improved.length > 0
      ? Math.round(improved.reduce((sum, r) => sum + (r.overallScore - r.previousScore!), 0) / improved.length)
      : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
            An overview of your user story quality analyses.
          </p>
        </div>
        <Link href="/analyze" className={buttonVariants()}>
          <Sparkles className="h-4 w-4" /> New Analysis
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Analyses" value={String(records.length)} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Average Score" value={`${avgScore}/100`} icon={<Gauge className="h-5 w-5" />} />
        <StatCard
          label="Avg. Improvement"
          value={improved.length > 0 ? `+${avgImprovement} pts` : "—"}
          icon={<TrendingUp className="h-5 w-5" />}
          hint={improved.length > 0 ? `across ${improved.length} re-analyzed stories` : "re-analyze a story to see this"}
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Analyses</h2>
        <Link href="/history" className="focus-ring rounded text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
          View all
        </Link>
      </div>
      <HistoryList records={records.slice(0, 5)} />
    </div>
  );
}
