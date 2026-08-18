"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const STEPS = [
  "Reading your user story",
  "Evaluating acceptance criteria",
  "Checking framework criteria",
  "Identifying ambiguity and scope issues",
  "Generating recommendations",
  "Rewriting the user story",
];

export function LoadingExperience({ done }: { done: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (done) {
      setIndex(STEPS.length - 1);
      return;
    }
    const interval = setInterval(() => {
      setIndex((prev) => (prev < STEPS.length - 2 ? prev + 1 : prev));
    }, 650);
    return () => clearInterval(interval);
  }, [done]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-md animate-fade-in rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6 shadow-sm"
    >
      <p className="mb-4 text-sm font-semibold">Analyzing your user story&hellip;</p>
      <ul className="space-y-3">
        {STEPS.map((step, i) => {
          const state = i < index ? "done" : i === index ? "active" : "pending";
          return (
            <li
              key={step}
              style={{ animationDelay: `${i * 40}ms` }}
              className={cn("flex items-center gap-3 text-sm animate-check-in", state === "pending" && "text-[rgb(var(--text-muted))]")}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  state === "done" && "border-success-500 bg-success-500 text-white",
                  state === "active" && "border-brand-500 text-brand-600",
                  state === "pending" && "border-[rgb(var(--border))]"
                )}
              >
                {state === "done" && <Check className="h-3 w-3" />}
                {state === "active" && <Loader2 className="h-3 w-3 animate-spin" />}
              </span>
              <span className={state === "active" ? "font-medium" : undefined}>{step}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
