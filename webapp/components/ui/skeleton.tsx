import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[rgb(var(--surface-2))]",
        className
      )}
      aria-hidden="true"
    />
  );
}
