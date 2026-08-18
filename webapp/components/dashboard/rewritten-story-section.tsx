"use client";

import { Sparkles, Copy, Check, ArrowRightCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/utils/use-copy";

export function RewrittenStorySection({
  rewrittenUserStory,
  rationale,
  onUseVersion,
}: {
  rewrittenUserStory: string;
  rationale: string[];
  onUseVersion?: (text: string) => void;
}) {
  const { copied, copy } = useCopy();

  return (
    <section aria-labelledby="rewritten-story-heading">
      <h2 id="rewritten-story-heading" className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <Sparkles className="h-5 w-5 text-brand-600" aria-hidden="true" /> Recommended User Story
      </h2>
      <Card className="border-brand-200 bg-brand-50/50 dark:border-brand-500/20 dark:bg-brand-500/[0.04]">
        <CardContent className="space-y-4">
          <p className="text-base font-medium leading-relaxed">{rewrittenUserStory}</p>

          {rationale.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">
                Why this is better
              </p>
              <ul className="mt-1.5 space-y-1 text-sm">
                {rationale.map((r, i) => (
                  <li key={i} className="flex gap-1.5">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-600 dark:text-success-500" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={() => copy(rewrittenUserStory)}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy User Story"}
            </Button>
            {onUseVersion && (
              <Button size="sm" onClick={() => onUseVersion(rewrittenUserStory)}>
                <ArrowRightCircle className="h-3.5 w-3.5" /> Use This Version
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
