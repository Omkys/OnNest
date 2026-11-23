import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = {
  title: "Sign in · OnNests",
  description: "Sign in to your OnNests organization",
};

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to OnNests."
      footer={
        <>
          New to OnNests?{" "}
          <Link href="/sign-up" className="font-semibold text-teal-700 hover:text-teal-800">
            Create account
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="text-sm text-slate-500">Loading…</div>}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
