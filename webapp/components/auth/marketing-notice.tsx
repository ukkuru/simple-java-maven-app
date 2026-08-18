import { Mail } from "lucide-react";

export function MarketingNotice() {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-[rgb(var(--surface-2))] p-3 text-xs leading-relaxed text-[rgb(var(--text-muted))]">
      <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        We&rsquo;ll use your email address to manage your account, whether you sign up with a
        password or with Google. With a password, you choose below whether to also receive
        product updates and marketing communications from Testmetry.com. With Google, there&rsquo;s
        no separate consent step at sign-up, so that&rsquo;s turned on by default — you can turn it
        off anytime in Settings.
      </span>
    </p>
  );
}
