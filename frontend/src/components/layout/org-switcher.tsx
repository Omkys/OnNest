"use client";

import { Building2, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthOrganization } from "@/lib/api";

type OrgSwitcherProps = {
  organization: AuthOrganization | null;
  collapsed?: boolean;
};

export function OrgSwitcher({ organization, collapsed }: OrgSwitcherProps) {
  return (
    <button
      type="button"
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-teal-200 hover:bg-teal-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-800 dark:hover:bg-teal-950/30",
        collapsed && "justify-center px-2"
      )}
      title="Switch organization"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-800 text-xs font-bold text-white">
        {(organization?.name?.[0] || "O").toUpperCase()}
      </span>
      {!collapsed ? (
        <>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {organization?.name || "Organization"}
            </span>
            <span className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-500 dark:text-slate-400">
              <Building2 className="h-3 w-3 shrink-0" />
              {organization?.organizationId || "Switch organization"}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-teal-700 dark:group-hover:text-teal-300" />
        </>
      ) : null}
    </button>
  );
}
