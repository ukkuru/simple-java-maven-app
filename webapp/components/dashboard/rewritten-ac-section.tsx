"use client";

import { Copy, Check, ArrowRightCircle } from "lucide-react";
import type { RewrittenScenario } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/utils/use-copy";

function formatScenarios(scenarios: RewrittenScenario[]): string {
  return scenarios
    .map((s) => `${s.title}\nGiven ${s.given}\nWhen ${s.when}\nThen ${s.then}`)
    .join("\n\n");
}

export function RewrittenAcSection({
  scenarios,
  onUseVersion,
}: {
  scenarios: RewrittenScenario[];
  onUseVersion?: (text: string) => void;
}) {
  const { copied, copy } = useCopy();
  if (scenarios.length === 0) return null;
  const formatted = formatScenarios(scenarios);

  return (
    <section aria-labelledby="rewritten-ac-heading">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 id="rewritten-ac-heading" className="text-lg font-semibold">
          Improved Acceptance Criteria
        </h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => copy(formatted)}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy All"}
          </Button>
          {onUseVersion && (
            <Button size="sm" onClick={() => onUseVersion(formatted)}>
              <ArrowRightCircle className="h-3.5 w-3.5" /> Use This Version
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {scenarios.map((s, i) => (
          <Card key={i}>
            <CardContent className="space-y-1.5 text-sm">
              <p className="font-semibold text-brand-700 dark:text-brand-300">{s.title}</p>
              <p>
                <span className="font-medium">Given </span>
                {s.given}
              </p>
              <p>
                <span className="font-medium">When </span>
                {s.when}
              </p>
              <p>
                <span className="font-medium">Then </span>
                {s.then}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
