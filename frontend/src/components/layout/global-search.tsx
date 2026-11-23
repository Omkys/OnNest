"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { createActions, navGroups, workspaceNav } from "@/lib/navigation";

type SearchHit = {
  label: string;
  href: string;
  group: string;
};

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const catalog = useMemo<SearchHit[]>(() => {
    const modules = [
      ...workspaceNav.map((i) => ({ label: i.label, href: i.href, group: "Overview" })),
      ...navGroups.flatMap((g) =>
        g.items.map((i) => ({ label: i.label, href: i.href, group: g.label }))
      ),
    ];
    const actions = createActions.map((a) => ({
      label: a.label,
      href: a.href,
      group: "Quick create",
    }));
    return [...modules, ...actions];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog.slice(0, 8);
    return catalog
      .filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.group.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [catalog, query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative hidden w-full max-w-xs lg:block" ref={ref}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search projects, units, tenants…"
        className="h-10 w-72 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-500"
        autoComplete="off"
      />

      {open ? (
        <div className="absolute left-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {query.trim() ? "Results" : "Suggestions"}
          </p>
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-slate-500">No matches</p>
          ) : (
            <ul className="pb-1">
              {results.map((item) => (
                <li key={`${item.group}-${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center justify-between px-3 py-2 text-sm hover:bg-teal-50 dark:hover:bg-slate-800"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.group}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
