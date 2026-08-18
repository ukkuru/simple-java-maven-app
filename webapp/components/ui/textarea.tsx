import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "focus-ring w-full resize-none rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm leading-relaxed placeholder:text-[rgb(var(--text-muted))]/70",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
