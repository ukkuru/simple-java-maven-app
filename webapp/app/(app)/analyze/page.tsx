import { Suspense } from "react";
import { AnalyzeContent } from "@/components/analysis/analyze-content";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyzePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <AnalyzeContent />
    </Suspense>
  );
}
