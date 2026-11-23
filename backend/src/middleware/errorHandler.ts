import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: number }).code === 11000
  ) {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists in your organization",
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.error(err instanceof Error ? err.message : "Unknown error");
  } else {
    console.error("Request failed");
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
