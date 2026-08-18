import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeTone = "success" | "warning" | "danger" | "neutral" | "brand";

const toneClasses: Record<BadgeTone, string> = {
  success: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500 ring-1 ring-inset ring-success-600/20",
  warning: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500 ring-1 ring-inset ring-warning-600/20",
  danger: "bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500 ring-1 ring-inset ring-danger-600/20",
  neutral: "bg-[rgb(var(--surface-2))] text-[rgb(var(--text-muted))] ring-1 ring-inset ring-[rgb(var(--border))]",
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 ring-1 ring-inset ring-brand-600/20",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
