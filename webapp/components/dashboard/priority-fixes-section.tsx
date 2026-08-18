import type { IssuePriority, PriorityFix } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, type BadgeTone } from "@/components/ui/badge";

const PRIORITY_META: Record<IssuePriority, { label: string; tone: BadgeTone; emoji: string }> = {
  high: { label: "High Priority", tone: "danger", emoji: "\u{1F534}" },
  medium: { label: "Medium Priority", tone: "warning", emoji: "\u{1F7E1}" },
  low: { label: "Low Priority", tone: "neutral", emoji: "\u{1F7E2}" },
};

export function PriorityFixesSection({ fixes }: { fixes: PriorityFix[] }) {
  if (fixes.length === 0) return null;

  return (
    <section aria-labelledby="fixes-heading">
      <h2 id="fixes-heading" className="mb-3 text-lg font-semibold">
        What Needs to Be Fixed
      </h2>
      <div className="space-y-3">
        {fixes.map((fix, i) => {
          const meta = PRIORITY_META[fix.priority];
          return (
            <Card key={i}>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={meta.tone}>
                    <span aria-hidden="true">{meta.emoji}</span> {meta.label}
                  </Badge>
                  <Badge tone="neutral">{fix.relatedCriterion}</Badge>
                </div>
                <p className="font-semibold">{fix.title}</p>
                <p className="text-sm text-[rgb(var(--text-muted))]">
                  <span className="font-medium text-[rgb(var(--text))]">Why it matters: </span>
                  {fix.whyItMatters}
                </p>
                <div className="rounded-lg bg-[rgb(var(--surface-2))] p-3 text-sm">
                  <span className="font-medium">Recommended fix: </span>
                  {fix.recommendedFix}
                  {fix.example && (
                    <p className="mt-1 italic text-[rgb(var(--text-muted))]">Example: &ldquo;{fix.example}&rdquo;</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
