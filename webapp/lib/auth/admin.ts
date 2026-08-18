/**
 * Admin access is granted by email allowlist (ADMIN_EMAILS, comma-separated)
 * rather than a database role. This avoids a bootstrapping problem — a role
 * column would need something to already be an admin in order to grant the
 * first one — and keeps who has admin access an explicit, auditable part of
 * deployment configuration rather than mutable application data.
 */
function getAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().has(email.toLowerCase());
}
