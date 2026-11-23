import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = {
  title: "Create account · OnNests",
  description: "Create your OnNests organization and owner account",
};

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your organization"
      subtitle="Create your OnNests account to get started."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-teal-700 hover:text-teal-800">
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
