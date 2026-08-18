import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
            {icon}
          </div>
        )}
        <div>
          <p className="text-xs text-[rgb(var(--text-muted))]">{label}</p>
          <p className="text-xl font-bold tabular-nums">{value}</p>
          {hint && <p className="text-xs text-[rgb(var(--text-muted))]">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
