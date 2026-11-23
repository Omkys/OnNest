import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_ORIGIN: z.string().default("http://localhost:3000"),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  SMTP_HOST: z.string().optional().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Never print raw env values or field contents
  console.error("Invalid environment variables. Check backend/.env against .env.example");
  process.exit(1);
}

const data = parsed.data;

export const env = {
  ...data,
  isSmtpConfigured: Boolean(data.SMTP_USER && data.SMTP_PASS),
};
