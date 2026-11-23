"use client";

import { useMemo, useState, type ComponentType } from "react";
import {
  Building2,
  DoorOpen,
  Home,
  CircleDot,
  CalendarClock,
  IndianRupee,
  AlertTriangle,
  Clock3,
  Percent,
  ArrowDownRight,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";

const PROJECTS = [
  { id: "all", name: "All projects" },
  { id: "lakeview", name: "Lakeview Residences" },
  { id: "greenpark", name: "Green Park Towers" },
  { id: "orchid", name: "Orchid Heights" },
];

type Metric = {
  label: string;
  value: string;
  hint: string;
  icon: ComponentType<{ className?: string }>;
  tone: "teal" | "slate" | "amber" | "rose" | "emerald";
};

const toneMap = {
  teal: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
};

const metrics: Metric[] = [
  { label: "Total Projects", value: "12", hint: "Across active portfolio", icon: Building2, tone: "teal" },
  { label: "Total Units", value: "286", hint: "Inventory tracked", icon: DoorOpen, tone: "slate" },
  { label: "Occupied Units", value: "214", hint: "Active tenancies", icon: Home, tone: "emerald" },
  { label: "Vacant Units", value: "48", hint: "Ready to lease", icon: CircleDot, tone: "amber" },
  { label: "Reserved / Booked", value: "24", hint: "Pre-move-in pipeline", icon: CalendarClock, tone: "teal" },
  { label: "Monthly Revenue", value: "₹48.2L", hint: "Confirmed collections", icon: IndianRupee, tone: "emerald" },
  { label: "Pending Rent", value: "₹6.4L", hint: "Awaiting settlement", icon: Clock3, tone: "amber" },
  { label: "Overdue Payments", value: "₹1.8L", hint: "12 tenant accounts", icon: AlertTriangle, tone: "rose" },
  { label: "Occupancy Rate", value: "86%", hint: "+2.4% vs last month", icon: Percent, tone: "teal" },
];

const moveIns = [
  { name: "Aisha Khan", unit: "LV-A-1204", date: "26 Nov" },
  { name: "Rahul Mehta", unit: "GP-B-508", date: "28 Nov" },
  { name: "Priya Nair", unit: "OH-C-302", date: "01 Dec" },
];

const moveOuts = [
  { name: "Suresh Iyer", unit: "LV-B-701", date: "30 Nov" },
  { name: "Neha Kapoor", unit: "GP-A-215", date: "02 Dec" },
];

const transactions = [
  { id: "TX-1042", party: "Aisha Khan", type: "Rent", amount: "₹28,500", status: "Confirmed" },
  { id: "TX-1041", party: "Green Park — Water", type: "Expense", amount: "₹12,400", status: "Posted" },
  { id: "TX-1040", party: "Rahul Mehta", type: "Booking advance", amount: "₹50,000", status: "Pending" },
  { id: "TX-1039", party: "Unit OH-C-302", type: "Electricity", amount: "₹3,240", status: "Confirmed" },
  { id: "TX-1038", party: "Security vendor", type: "Expense", amount: "₹45,000", status: "Posted" },
];

const fieldClass =
  "mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500";

const cardClass =
  "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800";

export function DashboardView() {
  const [projectId, setProjectId] = useState("all");
  const [fromDate, setFromDate] = useState("2026-11-01");
  const [toDate, setToDate] = useState("2026-11-30");

  const projectLabel = useMemo(
    () => PROJECTS.find((p) => p.id === projectId)?.name ?? "All projects",
    [projectId]
  );

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Daily pulse for property operations — occupancy, collections, and upcoming moves."
      />

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-3">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
            Project
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className={fieldClass}
            >
              {PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
            From
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
            To
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className={fieldClass}
            />
          </label>
        </div>
        <p className="text-xs text-slate-400 sm:pb-2">
          Showing{" "}
          <span className="font-medium text-slate-600 dark:text-slate-300">{projectLabel}</span>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className={cardClass}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {metric.label}
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{metric.hint}</p>
              </div>
              <span className={cn("rounded-xl p-2.5", toneMap[metric.tone])}>
                <metric.icon className="h-4 w-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <ArrowDownRight className="h-4 w-4 text-teal-700 dark:text-teal-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Upcoming move-ins
            </h2>
          </div>
          <ul className="space-y-3">
            {moveIns.map((row) => (
              <li key={row.unit} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{row.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{row.unit}</p>
                </div>
                <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
                  {row.date}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Upcoming move-outs
            </h2>
          </div>
          <ul className="space-y-3">
            {moveOuts.map((row) => (
              <li key={row.unit} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{row.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{row.unit}</p>
                </div>
                <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                  {row.date}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Recent transactions
            </h2>
          </div>
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                    {tx.party}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tx.id} · {tx.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{tx.amount}</p>
                  <p
                    className={cn(
                      "text-[11px]",
                      tx.status === "Pending"
                        ? "text-amber-600"
                        : "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {tx.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
