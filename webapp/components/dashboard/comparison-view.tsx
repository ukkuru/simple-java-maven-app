"use client";

import { useState } from "react";
import { diffWords } from "diff";
import type { RewrittenScenario } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";

type Mode = "side-by-side" | "original" | "improved" | "diff";

function DiffText({ before, after }: { before: string; after: string }) {
  const parts = diffWords(before, after);
  return (
    <p className="text-sm leading-relaxed">
      {parts.map((part, i) => (
        <span
          key={i}
          className={cn(
            part.added && "rounded bg-success-100 px-0.5 text-success-800 dark:bg-success-500/20 dark:text-success-300",
            part.removed && "rounded bg-danger-100 px-0.5 text-danger-700 line-through dark:bg-danger-500/20 dark:text-danger-300"
          )}
        >
          {part.value}
        </span>
      ))}
    </p>
  );
}

function formatAc(scenarios: RewrittenScenario[]): string {
  return scenarios.map((s) => `${s.title}\nGiven ${s.given}\nWhen ${s.when}\nThen ${s.then}`).join("\n\n");
}

export function ComparisonView({
  originalUserStory,
  improvedUserStory,
  originalAcceptanceCriteria,
  improvedAcceptanceCriteria,
}: {
  originalUserStory: string;
  improvedUserStory: string;
  originalAcceptanceCriteria: string;
  improvedAcceptanceCriteria: RewrittenScenario[];
}) {
  const [mode, setMode] = useState<Mode>("side-by-side");
  const improvedAcText = formatAc(improvedAcceptanceCriteria);

  return (
    <section aria-labelledby="comparison-heading">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 id="comparison-heading" className="text-lg font-semibold">
          Before vs After
        </h2>
        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
          <TabsList>
            <TabsTrigger value="side-by-side">Side-by-side</TabsTrigger>
            <TabsTrigger value="original">Original only</TabsTrigger>
            <TabsTrigger value="improved">Improved only</TabsTrigger>
            <TabsTrigger value="diff">Difference</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {mode === "side-by-side" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardContent>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">Original</p>
              <p className="mb-3 text-sm leading-relaxed">{originalUserStory || "(empty)"}</p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-[rgb(var(--text-muted))]">
                {originalAcceptanceCriteria || "(no acceptance criteria provided)"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-brand-200 dark:border-brand-500/20">
            <CardContent>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">Improved</p>
              <p className="mb-3 text-sm font-medium leading-relaxed">{improvedUserStory}</p>
              <p className="whitespace-pre-line text-sm leading-relaxed">{improvedAcText}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {mode === "original" && (
        <Card>
          <CardContent>
            <p className="mb-3 text-sm leading-relaxed">{originalUserStory || "(empty)"}</p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-[rgb(var(--text-muted))]">
              {originalAcceptanceCriteria || "(no acceptance criteria provided)"}
            </p>
          </CardContent>
        </Card>
      )}

      {mode === "improved" && (
        <Card className="border-brand-200 dark:border-brand-500/20">
          <CardContent>
            <p className="mb-3 text-sm font-medium leading-relaxed">{improvedUserStory}</p>
            <p className="whitespace-pre-line text-sm leading-relaxed">{improvedAcText}</p>
          </CardContent>
        </Card>
      )}

      {mode === "diff" && (
        <Card>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">User Story</p>
              <DiffText before={originalUserStory} after={improvedUserStory} />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--text-muted))]">
                Acceptance Criteria
              </p>
              <DiffText before={originalAcceptanceCriteria} after={improvedAcText} />
            </div>
            <p className="text-xs text-[rgb(var(--text-muted))]">
              <span className="rounded bg-success-100 px-1 dark:bg-success-500/20">Green</span> = added,{" "}
              <span className="rounded bg-danger-100 px-1 line-through dark:bg-danger-500/20">red strikethrough</span> = removed.
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
