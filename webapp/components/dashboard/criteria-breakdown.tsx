import type { CriterionResult } from "@/types";
import { CriterionCard } from "./criterion-card";

export function CriteriaBreakdown({ criteria }: { criteria: CriterionResult[] }) {
  return (
    <section aria-labelledby="criteria-heading">
      <h2 id="criteria-heading" className="mb-3 text-lg font-semibold">
        Criterion Breakdown
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {criteria.map((c) => (
          <CriterionCard key={c.key} criterion={c} />
        ))}
      </div>
    </section>
  );
}
