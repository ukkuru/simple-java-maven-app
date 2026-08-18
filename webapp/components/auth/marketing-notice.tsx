import { Mail } from "lucide-react";

export function MarketingNotice() {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-[rgb(var(--surface-2))] p-3 text-xs leading-relaxed text-[rgb(var(--text-muted))]">
      <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        We&rsquo;ll use your email address to manage your account, and — unless you opt out — to
        send you occasional product updates and marketing communications. You can change this
        anytime in Settings.
      </span>
    </p>
  );
}
