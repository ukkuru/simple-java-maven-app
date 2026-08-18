"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

function colorForScore(score: number): { stroke: string; text: string } {
  if (score >= 90) return { stroke: "#10b981", text: "text-success-600 dark:text-success-500" };
  if (score >= 80) return { stroke: "#22c55e", text: "text-success-600 dark:text-success-500" };
  if (score >= 70) return { stroke: "#f59e0b", text: "text-warning-600 dark:text-warning-500" };
  if (score >= 50) return { stroke: "#f97316", text: "text-warning-700 dark:text-warning-500" };
  return { stroke: "#ef4444", text: "text-danger-600 dark:text-danger-500" };
}

export function ScoreRing({
  score,
  size = 176,
  strokeWidth = 14,
  label,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const { stroke, text } = colorForScore(score);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(score));
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="relative inline-flex animate-score-pop items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(var(--surface-2))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-4xl font-bold tabular-nums", text)} aria-hidden="true">
          {Math.round(animated)}
        </span>
        <span className="text-xs text-[rgb(var(--text-muted))]">/ 100</span>
        {label && <span className={cn("mt-1 text-xs font-semibold", text)}>{label}</span>}
      </div>
    </div>
  );
}
