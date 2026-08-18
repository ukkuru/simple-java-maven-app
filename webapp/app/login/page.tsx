import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, isGoogleAuthConfigured } from "@/lib/auth/options";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue analyzing your user stories."
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link href="/register" className="focus-ring rounded font-medium text-brand-600 hover:underline dark:text-brand-400">
            Sign up
          </Link>
        </>
      }
    >
      <Suspense>
        <LoginForm googleEnabled={isGoogleAuthConfigured} />
      </Suspense>
    </AuthShell>
  );
}
