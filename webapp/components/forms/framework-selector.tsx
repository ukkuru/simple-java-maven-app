"use client";

import { Check } from "lucide-react";
import type { Framework } from "@/types";
import { SMART_CRITERIA, INVEST_CRITERIA } from "@/lib/scoring/config";
import { cn } from "@/lib/utils/cn";

const OPTIONS: { value: Framework; title: string; tagline: string }[] = [
  { value: "SMART", title: "SMART", tagline: "Specific, Measurable, Achievable, Relevant, Time-bound" },
  { value: "INVEST", title: "INVEST", tagline: "Independent, Negotiable, Valuable, Estimable, Small, Testable" },
];

export function FrameworkSelector({
  value,
  onChange,
}: {
  value: Framework;
  onChange: (f: Framework) => void;
}) {
  const criteria = value === "SMART" ? SMART_CRITERIA : INVEST_CRITERIA;

  return (
    <div>
      <div role="radiogroup" aria-label="Choose quality framework" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={cn(
                "focus-ring relative flex flex-col gap-1 rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 ring-1 ring-brand-500"
                  : "border-[rgb(var(--border))] hover:border-brand-300 hover:bg-[rgb(var(--surface-2))]"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{opt.title}</span>
                {active && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
              <span className="text-xs text-[rgb(var(--text-muted))]">{opt.tagline}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" aria-live="polite">
        {criteria.map((c) => (
          <span
            key={c.key}
            title={c.description}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-2.5 py-1 text-xs text-[rgb(var(--text-muted))]"
          >
            {c.name}
          </span>
        ))}
      </div>
    </div>
  );
}
