"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchMe, signOut } from "@/lib/api";
import {
  clearAuth,
  getStoredOrganization,
  getStoredToken,
  getStoredUser,
} from "@/lib/auth-store";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { cn } from "@/lib/utils";

const COLLAPSE_KEY = "onnests_sidebar_collapsed";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!getStoredToken()) {
      router.replace("/sign-in");
      return;
    }
    const saved = localStorage.getItem(COLLAPSE_KEY);
    if (saved === "1") setCollapsed(true);
    setReady(true);
  }, [router]);

  const { data, isError } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: ready,
  });

  const user = data?.data.user ?? getStoredUser();
  const organization = data?.data.organization ?? getStoredOrganization();

  useEffect(() => {
    if (isError && ready) {
      clearAuth();
      router.replace("/sign-in");
    }
  }, [isError, ready, router]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      clearAuth();
      router.replace("/sign-in");
    }
  };

  // Always keep `{children}` in the tree so Next.js can validate the segment.
  // Auth gating only affects chrome / visibility — never omit children.
  return (
    <div className="min-h-screen bg-[#f3f6f4] dark:bg-[#0b1412]">
      {ready ? (
        <Sidebar
          collapsed={collapsed}
          onToggle={toggleCollapsed}
          organization={organization}
          onSignOut={handleSignOut}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
      ) : null}

      <div
        className={cn(
          "min-h-screen transition-[padding] duration-300",
          ready ? (collapsed ? "lg:pl-[72px]" : "lg:pl-[250px]") : undefined
        )}
      >
        {ready ? (
          <TopNav
            user={user}
            organization={organization}
            onMenuClick={() => setMobileOpen(true)}
            onSignOut={handleSignOut}
          />
        ) : (
          <div className="flex h-16 items-center border-b border-slate-200/80 px-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Loading workspace…
          </div>
        )}

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {!ready ? (
            <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Preparing your organization workspace…
            </div>
          ) : null}
          <div className={cn(!ready && "pointer-events-none opacity-0")}>{children}</div>
        </main>
      </div>
    </div>
  );
}
