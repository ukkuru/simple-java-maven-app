import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAnalysis } from "@/lib/db/history";
import { ResultsDashboard } from "@/components/dashboard/results-dashboard";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

export default async function HistoryDetailPage({ params }: { params: { id: string } }) {
  const record = await getAnalysis(params.id);
  if (!record) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/history"
        className="focus-ring mb-4 inline-flex items-center gap-1.5 rounded text-sm font-medium text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to history
      </Link>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{record.title}</h1>
        <Badge tone="neutral">{formatDate(record.createdAt)}</Badge>
      </div>
      <ResultsDashboard
        result={record.result}
        originalUserStory={record.userStory}
        originalAcceptanceCriteria={record.acceptanceCriteria}
        previousScore={record.previousScore}
      />
    </div>
  );
}
