"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getStoredToken } from "@/lib/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function useRealtime() {
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

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
    socket.on("connected", (payload) => {
      setLastEvent(`Joined org room ${payload.organizationId}`);
    });
    socket.on("user:signed_in", (payload) => {
      setLastEvent(`Teammate signed in: ${payload.email}`);
    });
    socket.on("organization:created", (payload) => {
      setLastEvent(`Organization ready: ${payload.name}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { connected, lastEvent };
}
