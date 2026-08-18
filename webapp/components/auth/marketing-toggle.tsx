"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";

export function MarketingToggle({ initialValue }: { initialValue: boolean }) {
  const [enabled, setEnabled] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function handleToggle() {
    const next = !enabled;
    setEnabled(next);
    setSaving(true);
    try {
      const res = await fetch("/api/account/marketing-preference", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketingOptIn: next }),
      });
      if (!res.ok) throw new Error();
      toast({
        tone: "success",
        title: next ? "Marketing emails enabled" : "Marketing emails disabled",
        description: next
          ? "You'll receive occasional product updates from Testmetry.com."
          : "You won't receive marketing emails. Account emails still apply.",
      });
    } catch {
      setEnabled(!next);
      toast({ tone: "error", title: "Couldn't save your preference", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={handleToggle}
      disabled={saving}
      className={cn(
        "focus-ring relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60",
        enabled ? "bg-brand-600" : "bg-[rgb(var(--surface-2))]"
      )}
    >
      <span
        className={cn(
          "inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}
