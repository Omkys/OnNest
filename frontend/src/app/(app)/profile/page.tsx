"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/lib/api";
import { getStoredOrganization, getStoredUser } from "@/lib/auth-store";
import { PageHeader } from "@/components/layout/page-header";

export default function ProfilePage() {
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  const user = data?.data.user ?? getStoredUser();
  const organization = data?.data.organization ?? getStoredOrganization();

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your account details within the current organization."
      />
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Name</dt>
            <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
              {user?.fullName || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Email</dt>
            <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
              {user?.email || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Phone</dt>
            <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
              {user?.phoneNumber || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Role</dt>
            <dd className="mt-1 font-medium capitalize text-slate-900 dark:text-slate-100">
              {user?.role || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Organization
            </dt>
            <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
              {organization?.name || "—"}
            </dd>
            <dd className="mt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400">
              {organization?.organizationId}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
