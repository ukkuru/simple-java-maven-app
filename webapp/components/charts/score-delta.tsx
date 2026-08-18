import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ScoreDelta({ from, to }: { from: number; to: number }) {
  const delta = to - from;
  const improved = delta > 0;
  const worsened = delta < 0;

  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium">
      <span className="tabular-nums text-[rgb(var(--text-muted))]">{from}</span>
      <span className="text-[rgb(var(--text-muted))]">&rarr;</span>
      <span className="tabular-nums font-semibold">{to}</span>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
          improved && "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500",
          worsened && "bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500",
          !improved && !worsened && "bg-[rgb(var(--surface-2))] text-[rgb(var(--text-muted))]"
        )}
      >
        {improved && <TrendingUp className="h-3 w-3" />}
        {worsened && <TrendingDown className="h-3 w-3" />}
        {!improved && !worsened && <Minus className="h-3 w-3" />}
        {delta > 0 ? `+${delta}` : delta} pts
        {improved && delta >= 10 ? " \u{1F389}" : ""}
      </span>
    </span>
  );
}
