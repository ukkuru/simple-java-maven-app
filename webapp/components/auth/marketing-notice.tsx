import { Mail } from "lucide-react";

export function MarketingNotice() {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-[rgb(var(--surface-2))] p-3 text-xs leading-relaxed text-[rgb(var(--text-muted))]">
      <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        We use your email to manage your account. If you sign up with a password, you choose
        below whether to get marketing emails from Testmetry.com. If you sign up with Google,
        that&rsquo;s on by default, and you can turn it off anytime in Settings.
      </span>
    </p>
  );
}
