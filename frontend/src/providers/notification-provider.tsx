"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { getStoredToken } from "@/lib/auth-store";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  type: "info" | "success" | "warning" | "payment" | "booking";
  createdAt: string;
  read: boolean;
  href?: string;
};

type NotificationContextValue = {
  connected: boolean;
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const STORAGE_KEY = "onnests_notifications";

function loadStored(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppNotification[]) : [];
  } catch {
    return [];
  }
}

function persist(items: AppNotification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
}

function makeId() {
  return `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    setNotifications(loadStored());
  }, []);

  const push = useCallback((item: Omit<AppNotification, "id" | "createdAt" | "read">) => {
    setNotifications((prev) => {
      const next = [
        {
          ...item,
          id: makeId(),
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ].slice(0, 50);
      persist(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    const socket: Socket = io(API_URL, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("connected", (payload: { organizationId?: string }) => {
      push({
        title: "Realtime connected",
        body: `Joined organization channel ${payload.organizationId || ""}`.trim(),
        type: "success",
        href: "/dashboard",
      });
    });

    socket.on(
      "user:signed_in",
      (payload: { email?: string; organizationId?: string }) => {
        push({
          title: "Team activity",
          body: `${payload.email || "A teammate"} signed in`,
          type: "info",
          href: "/users",
        });
      }
    );

    socket.on(
      "organization:created",
      (payload: { name?: string; organizationId?: string }) => {
        push({
          title: "Organization ready",
          body: `${payload.name || "Workspace"} is live`,
          type: "success",
          href: "/settings",
        });
      }
    );

    socket.on(
      "notification",
      (payload: {
        title?: string;
        body?: string;
        type?: AppNotification["type"];
        href?: string;
      }) => {
        push({
          title: payload.title || "Notification",
          body: payload.body || "",
          type: payload.type || "info",
          href: payload.href,
        });
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [push]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      persist(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      persist(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    persist([]);
  }, []);

  const value = useMemo(
    () => ({
      connected,
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      markAsRead,
      markAllRead,
      clearAll,
    }),
    [connected, notifications, markAsRead, markAllRead, clearAll]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}
