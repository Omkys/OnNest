import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1f1c] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 20%, rgba(45,212,191,0.22), transparent 45%), radial-gradient(ellipse at 80% 0%, rgba(15,118,110,0.35), transparent 40%), linear-gradient(180deg, rgba(11,31,28,0.2), #0b1f1c 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-sm font-bold text-[#06201c]">
              ON
            </span>
            <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
              OnNests
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-teal-400 text-[#06201c] hover:bg-teal-300">
                Create account
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-16">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-teal-300/90">
            Multi-tenant SaaS
          </p>
          <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            OnNests
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-teal-50/75 sm:text-lg">
            Organization-scoped property operations. Every account, lease, and document lives under a
            dedicated organization ID — realtime and isolated.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-up">
              <Button size="lg" className="bg-teal-400 text-[#06201c] hover:bg-teal-300">
                Create account
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
