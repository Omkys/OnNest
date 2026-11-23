"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus, ChevronRight } from "lucide-react";
import { createActions, getBreadcrumbs } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import type { AuthOrganization, AuthUser } from "@/lib/api";
import { ThemeToggle } from "./theme-toggle";
import { NotificationsPopover } from "./notifications-popover";
import { ProfilePopover } from "./profile-popover";
import { GlobalSearch } from "./global-search";

type TopNavProps = {
  user: AuthUser | null;
  organization: AuthOrganization | null;
  onMenuClick: () => void;
  onSignOut: () => void;
};

export function TopNav({ user, organization, onMenuClick, onSignOut }: TopNavProps) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);
  const [createOpen, setCreateOpen] = useState(false);
  const createRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!createRef.current?.contains(e.target as Node)) {
        setCreateOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f3f6f4]/90 backdrop-blur-md dark:border-slate-800 dark:bg-[#0b1412]/90">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-900 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden min-w-0 items-center gap-1 text-sm md:flex">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.href}-${crumb.label}`} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
              ) : null}
              <Link
                href={crumb.href}
                className={
                  index === crumbs.length - 1
                    ? "truncate font-semibold text-slate-900 dark:text-slate-100"
                    : "truncate text-slate-500 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300"
                }
              >
                {crumb.label}
              </Link>
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <GlobalSearch />
          <ThemeToggle />
          <NotificationsPopover />

          <div className="relative" ref={createRef}>
            <Button
              type="button"
              className="h-10 gap-1.5 px-3"
              onClick={() => setCreateOpen((v) => !v)}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
            {createOpen ? (
              <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                {createActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="block px-3.5 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-200"
                    onClick={() => setCreateOpen(false)}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <ProfilePopover
            user={user}
            organization={organization}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </header>
  );
}
