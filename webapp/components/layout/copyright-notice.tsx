import { cn } from "@/lib/utils/cn";

export function CopyrightNotice({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-[rgb(var(--text-muted))]", className)}>
      &copy; {new Date().getFullYear()} Testmetry.com. All rights reserved.
    </p>
  );
}
