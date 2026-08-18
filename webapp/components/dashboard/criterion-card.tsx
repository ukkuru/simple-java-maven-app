import { CheckCircle2, AlertTriangle, XCircle, MinusCircle } from "lucide-react";
import type { CriterionResult } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const STATUS_META: Record<
  CriterionResult["status"],
  { label: string; tone: BadgeTone; icon: typeof CheckCircle2; ring: string }
> = {
  strong: { label: "Strong", tone: "success", icon: CheckCircle2, ring: "ring-success-500/30" },
  good: { label: "Good", tone: "success", icon: CheckCircle2, ring: "ring-success-500/20" },
  needs_improvement: { label: "Needs Improvement", tone: "warning", icon: AlertTriangle, ring: "ring-warning-500/30" },
  poor: { label: "Poor", tone: "danger", icon: XCircle, ring: "ring-danger-500/30" },
  not_applicable: { label: "Not Applicable", tone: "neutral", icon: MinusCircle, ring: "ring-[rgb(var(--border))]" },
};

export function CriterionCard({ criterion }: { criterion: CriterionResult }) {
  const meta = STATUS_META[criterion.status];
  const Icon = meta.icon;

  return (
    <Card className={cn("ring-1", meta.ring)}>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{criterion.name}</h3>
          {criterion.score !== null ? (
            <span className="text-lg font-bold tabular-nums">{criterion.score}<span className="text-xs font-normal text-[rgb(var(--text-muted))]"> /100</span></span>
          ) : (
            <span className="text-xs text-[rgb(var(--text-muted))]">N/A</span>
          )}
        </div>

        <Badge tone={meta.tone} className="w-fit">
          <Icon className="h-3 w-3" aria-hidden="true" />
          {meta.label}
        </Badge>

        <p className="text-sm leading-relaxed text-[rgb(var(--text-muted))]">{criterion.assessment}</p>

        {criterion.issues.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">Issues</p>
            <ul className="mt-1 space-y-1 text-sm">
              {criterion.issues.map((issue, i) => (
                <li key={i} className="flex gap-1.5">
                  <span aria-hidden="true">&bull;</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {criterion.recommendations.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">Recommendations</p>
            <ul className="mt-1 space-y-1 text-sm">
              {criterion.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-1.5">
                  <span aria-hidden="true">&rarr;</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
