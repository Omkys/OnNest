"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, Pencil, UserRound } from "lucide-react";
import type { AuthOrganization, AuthUser } from "@/lib/api";

type ProfilePopoverProps = {
  user: AuthUser | null;
  organization: AuthOrganization | null;
  onSignOut: () => void;
};

export function ProfilePopover({ user, organization, onSignOut }: ProfilePopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const initials = `${(user?.firstName?.[0] || "U").toUpperCase()}${(
    user?.lastName?.[0] || ""
  ).toUpperCase()}`;

  return (
    <div className="relative hidden sm:block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:border-teal-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-800"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-slate-800 text-xs font-semibold text-white">
          {initials}
        </span>
        <span className="min-w-0 text-left">
          <span className="block max-w-[140px] truncate text-xs font-semibold capitalize text-slate-900 dark:text-slate-100">
            {user?.role || "member"}
          </span>
          <span className="block max-w-[140px] truncate text-[10px] text-slate-500 dark:text-slate-400">
            {user?.email || "—"}
          </span>
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-slate-800 text-sm font-semibold text-white">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <UserRound className="h-3.5 w-3.5" />
                  Profile
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {user?.fullName || "User"}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 px-4 py-4 text-xs">
            <div>
              <p className="text-slate-400">Phone</p>
              <p className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">
                {user?.phoneNumber || "—"}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Organization</p>
              <p className="mt-0.5 truncate font-medium text-slate-800 dark:text-slate-200">
                {organization?.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Org ID</p>
              <p className="mt-0.5 truncate font-mono text-[11px] text-slate-800 dark:text-slate-200">
                {organization?.organizationId || "—"}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Designation</p>
              <p className="mt-0.5 font-medium capitalize text-slate-800 dark:text-slate-200">
                {user?.role || "—"}
              </p>
            </div>
          </div>

          <div className="px-4 pb-2">
            <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
              {user?.role || "member"}
            </span>
          </div>

          <div className="space-y-2 border-t border-slate-200 p-3 dark:border-slate-700">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              <Pencil className="h-4 w-4" />
              Edit profile / settings
            </Link>
            <button
              type="button"
              onClick={onSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
