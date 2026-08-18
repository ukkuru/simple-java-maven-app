import { listAnalyses } from "@/lib/db/history";
import { HistoryList } from "@/components/dashboard/history-list";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const records = await listAnalyses(100);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Analysis History</h1>
      <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
        Every analysis you&rsquo;ve run, most recent first. Click one to see the full breakdown.
      </p>
      <div className="mt-6">
        <HistoryList records={records} emptyHint="You haven't analyzed any user stories yet." />
      </div>
    </div>
  );
}
