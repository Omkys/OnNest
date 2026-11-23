"use client";

import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getStoredToken } from "@/lib/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  type: "info" | "success" | "warning";
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useNotifications() {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const push = useCallback((item: Omit<AppNotification, "id" | "read">) => {
    setNotifications((prev) => [
      { ...item, id: makeId(), read: false },
      ...prev,
    ].slice(0, 40));
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    const socket: Socket = io(API_URL, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setConnected(true);
      push({
        title: "Realtime connected",
        body: "Listening for organization activity",
        at: new Date().toISOString(),
        type: "success",
      });
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("connected", (payload: { organizationId?: string }) => {
      push({
        title: "Joined organization channel",
        body: payload.organizationId
          ? `Room ${payload.organizationId}`
          : "Organization room ready",
        at: new Date().toISOString(),
        type: "info",
      });
    });

    socket.on(
      "user:signed_in",
      (payload: { email?: string; organizationId?: string }) => {
        push({
          title: "Teammate signed in",
          body: payload.email || "A user signed in to your organization",
          at: new Date().toISOString(),
          type: "info",
        });
      }
    );

    socket.on(
      "organization:created",
      (payload: { name?: string; organizationId?: string }) => {
        push({
          title: "Organization ready",
          body: payload.name || payload.organizationId || "Organization created",
          at: new Date().toISOString(),
          type: "success",
        });
      }
    );

    socket.on("tenant:activity", (payload: { type?: string; organizationId?: string }) => {
      push({
        title: "Organization activity",
        body: `${payload.type || "update"} · ${payload.organizationId || "org"}`,
        at: new Date().toISOString(),
        type: "warning",
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [push]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => setNotifications([]);

  return {
    connected,
    notifications,
    unreadCount,
    markAllRead,
    markRead,
    clearAll,
  };
}
