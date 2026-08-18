import { CheckCircle2 } from "lucide-react";
import type { Strength } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

export function StrengthsSection({ strengths }: { strengths: Strength[] }) {
  if (strengths.length === 0) return null;

  return (
    <section aria-labelledby="strengths-heading">
      <h2 id="strengths-heading" className="mb-3 text-lg font-semibold">
        What&rsquo;s Already Good
      </h2>
      <Card className="border-success-200 bg-success-50/60 dark:border-success-500/20 dark:bg-success-500/[0.04]">
        <CardContent>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-600 dark:text-success-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-success-800 dark:text-success-400">{s.title}</p>
                  <p className="text-sm text-[rgb(var(--text-muted))]">{s.explanation}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
