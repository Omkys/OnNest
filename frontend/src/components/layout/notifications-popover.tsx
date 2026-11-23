"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function NotificationsPopover() {
  const { connected, notifications, unreadCount, markAllRead, markRead, clearAll } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markAllRead();
        }}
        className="relative rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-teal-300"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : (
          <span
            className={cn(
              "absolute right-2 top-2 h-1.5 w-1.5 rounded-full",
              connected ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
            )}
          />
        )}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[22rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5 dark:border-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Notifications
              </p>
              <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <Radio className={cn("h-3 w-3", connected ? "text-emerald-500" : "text-slate-400")} />
                {connected ? "Live · organization channel" : "Connecting…"}
              </p>
            </div>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400"
            >
              Clear
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No notifications yet. Org events will appear here in realtime.
              </p>
            ) : (
              <ul>
                {notifications.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => markRead(item.id)}
                      className={cn(
                        "flex w-full gap-3 border-b border-slate-100 px-3 py-3 text-left transition last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70",
                        !item.read && "bg-teal-50/50 dark:bg-teal-950/20"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-1 h-2 w-2 shrink-0 rounded-full",
                          item.type === "success" && "bg-emerald-500",
                          item.type === "warning" && "bg-amber-500",
                          item.type === "info" && "bg-teal-500"
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                            {item.title}
                          </span>
                          <span className="shrink-0 text-[10px] text-slate-400">
                            {formatTime(item.at)}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {item.body}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
