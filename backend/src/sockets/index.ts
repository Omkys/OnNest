import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { env } from "../config/env";
import { verifyToken } from "../utils/jwt";

let io: Server | null = null;

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }
  return io;
}

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        (socket.handshake.auth?.token as string | undefined) ||
        (socket.handshake.headers.authorization?.startsWith("Bearer ")
          ? socket.handshake.headers.authorization.slice(7)
          : undefined);

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const payload = verifyToken(token);
      socket.data.user = payload;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user as {
      sub: string;
      organizationId: string;
      organizationPublicId: string;
    };

    const orgRoom = `org:${user.organizationId}`;
    socket.join(orgRoom);
    socket.join(`user:${user.sub}`);

    socket.emit("connected", {
      userId: user.sub,
      organizationId: user.organizationPublicId,
      room: orgRoom,
    });

    socket.on("ping", () => {
      socket.emit("pong", { at: new Date().toISOString() });
    });

    socket.on("disconnect", () => {
      // noop — room membership cleared automatically
    });
  });

  return io;
}
