import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, isGoogleAuthConfigured } from "@/lib/auth/options";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <AuthShell
      title="Create your account"
      subtitle="Analyze your first user story in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="focus-ring rounded font-medium text-brand-600 hover:underline dark:text-brand-400">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm googleEnabled={isGoogleAuthConfigured} />
    </AuthShell>
  );
}
