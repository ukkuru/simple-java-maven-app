"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Eraser, Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function TextEditorField({
  id,
  label,
  helperText,
  value,
  onChange,
  placeholder,
  onExample,
  maxLength,
  minRows = 4,
  emptyState,
  error,
}: {
  id: string;
  label: string;
  helperText?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onExample?: () => void;
  maxLength: number;
  minRows?: number;
  emptyState?: ReactNode;
  error?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, minRows * 24)}px`;
  }, [value, minRows]);

  const count = value.length;
  const nearLimit = count > maxLength * 0.9;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        <div className="flex items-center gap-1">
          {onExample && (
            <Button type="button" variant="ghost" size="sm" onClick={onExample}>
              <Wand2 className="h-3.5 w-3.5" /> Example
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            disabled={!value}
            aria-label={`Clear ${label}`}
          >
            <Eraser className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      </div>
      {helperText && <p className="mb-2 text-xs text-[rgb(var(--text-muted))]">{helperText}</p>}
      <div className="relative">
        <Textarea
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={minRows}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn("min-h-[110px]", error && "border-danger-500")}
        />
        {!value && emptyState && (
          <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-center gap-1.5 text-xs text-[rgb(var(--text-muted))]/80">
            {emptyState}
          </div>
        )}
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        {error ? (
          <p id={`${id}-error`} role="alert" className="text-xs text-danger-600 dark:text-danger-500">
            {error}
          </p>
        ) : (
          <span />
        )}
        <span className={cn("text-xs tabular-nums text-[rgb(var(--text-muted))]", nearLimit && "text-warning-600")}>
          {count.toLocaleString()} / {maxLength.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
