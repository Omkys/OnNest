import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Reset password · OnNests",
  description: "Choose a new OnNests password",
};

function ResetPasswordFallback() {
  return <div className="text-sm text-slate-500">Loading…</div>;
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Enter a new password for your OnNests account."
      footer={
        <>
          Back to{" "}
          <Link href="/sign-in" className="font-semibold text-teal-700 hover:text-teal-800">
            Sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
