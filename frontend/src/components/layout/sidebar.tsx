"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  bottomNav,
  navGroups,
  workspaceNav,
  type NavItem,
} from "@/lib/navigation";
import { OrgSwitcher } from "./org-switcher";
import type { AuthOrganization } from "@/lib/api";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  organization: AuthOrganization | null;
  onSignOut: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

function NavLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : item.description}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-teal-50 text-teal-900 shadow-[inset_3px_0_0_0_#0f766e] dark:bg-teal-950/40 dark:text-teal-100 dark:shadow-[inset_3px_0_0_0_#2dd4bf]"
          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-slate-100",
        collapsed && "justify-center px-2"
      )}
    >
      <item.icon
        className={cn(
          "h-[18px] w-[18px] shrink-0",
          active
            ? "text-teal-700 dark:text-teal-300"
            : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
        )}
      />
      {!collapsed ? <span className="truncate">{item.label}</span> : null}
    </Link>
  );
}

export function Sidebar({
  collapsed,
  onToggle,
  organization,
  onSignOut,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={onMobileClose}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/90 bg-[#f7faf8] transition-all duration-300 dark:border-slate-800 dark:bg-[#101a17]",
          collapsed ? "w-[72px]" : "w-[250px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-slate-200/80 px-3 dark:border-slate-800",
            collapsed ? "justify-center" : "justify-between gap-2"
          )}
        >
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onMobileClose}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-800 text-sm font-bold text-white shadow-sm">
              ON
            </span>
            {!collapsed ? (
              <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                OnNests
              </span>
            ) : null}
          </Link>
          {!collapsed ? (
            <button
              type="button"
              onClick={onToggle}
              className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:inline-flex"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggle}
              className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700 dark:hover:bg-slate-800 lg:absolute lg:right-2 lg:top-4 lg:inline-flex"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="px-3 py-3">
          <OrgSwitcher organization={organization} collapsed={collapsed} />
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-3">
          <div className="mb-4 space-y-1">
            {!collapsed ? (
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Overview
              </p>
            ) : null}
            {workspaceNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                collapsed={collapsed}
                onNavigate={onMobileClose}
              />
            ))}
          </div>

          {navGroups.map((group) => (
            <div key={group.id} className="mb-4 space-y-1">
              {!collapsed ? (
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {group.label}
                </p>
              ) : (
                <div className="mx-auto my-2 h-px w-6 bg-slate-200 dark:bg-slate-700" />
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={onMobileClose}
                />
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200/80 px-2 py-3 dark:border-slate-800">
          <div className="space-y-1">
            {bottomNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                collapsed={collapsed}
                onNavigate={onMobileClose}
              />
            ))}
            <button
              type="button"
              onClick={onSignOut}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-slate-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-300",
                collapsed && "justify-center px-2"
              )}
              title="Sign out"
            >
              <LogOut className="h-[18px] w-[18px]" />
              {!collapsed ? <span>Sign out</span> : null}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 lg:flex"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>
    </>
  );
}
