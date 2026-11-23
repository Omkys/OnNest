"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const active = mounted ? theme || "system" : "system";
  const TriggerIcon = !mounted
    ? Monitor
    : resolvedTheme === "dark"
      ? Moon
      : Sun;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Change theme"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-teal-300"
      >
        <TriggerIcon className="h-4 w-4" />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Theme
          </p>
          {options.map((option) => {
            const selected = active === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition",
                  selected
                    ? "bg-teal-50 text-teal-900 dark:bg-teal-950/50 dark:text-teal-200"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                )}
              >
                <option.icon className="h-4 w-4 shrink-0 opacity-80" />
                <span className="flex-1 text-left">{option.label}</span>
                {selected ? <Check className="h-4 w-4 text-teal-600 dark:text-teal-400" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
