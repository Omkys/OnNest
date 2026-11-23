import { PageHeader } from "./page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ModulePlaceholderProps = {
  title: string;
  description: string;
  bullets?: string[];
  primaryAction?: { label: string; href: string };
};

export function ModulePlaceholder({
  title,
  description,
  bullets = [],
  primaryAction,
}: ModulePlaceholderProps) {
  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          primaryAction ? (
            <Link href={primaryAction.href}>
              <Button>{primaryAction.label}</Button>
            </Link>
          ) : null
        }
      />

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 dark:border-slate-700 dark:bg-slate-900/50 sm:p-8">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
          Module workspace ready
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          This shell is wired into the OnNests ERP navigation. Workflows, tabs, filters and
          detail views will land here next.
        </p>
        {bullets.length > 0 ? (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {bullets.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-slate-200 bg-[#f7faf8] px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
