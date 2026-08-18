"use client";

import { Sparkles, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  onAnalyze,
  onTryExample,
}: {
  onAnalyze: () => void;
  onTryExample: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center animate-fade-in">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
        <Sparkles className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Is your user story actually ready for development?
      </h1>
      <p className="mt-3 text-[rgb(var(--text-muted))]">
        Analyze your User Story and Acceptance Criteria against SMART or INVEST and get
        actionable recommendations in seconds.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={onAnalyze}>
          <Sparkles className="h-4 w-4" /> Analyze My User Story
        </Button>
        <Button size="lg" variant="outline" onClick={onTryExample}>
          <PlayCircle className="h-4 w-4" /> Try an Example
        </Button>
      </div>
    </div>
  );
}
