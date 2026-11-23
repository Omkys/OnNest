import Link from "next/link";
import { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f6f4]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(15,118,110,0.18), transparent 42%), radial-gradient(circle at 88% 8%, rgba(30,64,55,0.12), transparent 36%), linear-gradient(135deg, rgba(255,255,255,0.7), transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f766e' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-800 text-sm font-bold text-white shadow-sm transition group-hover:bg-teal-900">
              ON
            </span>
            <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-slate-900">
              OnNests
            </span>
          </Link>
          <p className="hidden text-sm text-slate-500 sm:block">
            Multi-tenant property operations
          </p>
        </header>

        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-2xl border border-white/70 bg-white/90 p-7 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-8">
              <div className="mb-7">
                <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.7rem]">
                  {title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {subtitle}
                </p>
              </div>
              {children}
              {footer ? <div className="mt-6 text-center text-sm text-slate-600">{footer}</div> : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
