import { Mail } from "lucide-react";

export function MarketingNotice() {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-[rgb(var(--surface-2))] p-3 text-xs leading-relaxed text-[rgb(var(--text-muted))]">
      <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        We&rsquo;ll use your email address to manage your account, whether you sign up with a
        password or with Google. If you opt in — at sign-up or anytime later in Settings — we may
        also send it occasional product updates and marketing communications from Testmetry.com.
      </span>
    </p>
  );
}
