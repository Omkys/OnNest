import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { initSocket } from "./sockets";
import { verifySmtpConnection } from "./services/mailService";

async function bootstrap() {
  await connectDB();

  try {
    await verifySmtpConnection();
  } catch {
    console.warn("SMTP verification failed — password reset emails may not send");
  }

  const app = express();
  const server = http.createServer(app);

  initSocket(server);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    })
  );
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      service: "onnests-api",
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/auth", authRoutes);

  app.use(errorHandler);

  server.listen(env.PORT, () => {
    console.log(`OnNests API listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
