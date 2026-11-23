import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { Organization } from "../models/Organization";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const bearer =
      header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    const cookieToken = req.cookies?.token as string | undefined;
    const token = bearer || cookieToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }
}

/** Ensures the authenticated user belongs to an active organization */
export async function requireTenant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.organizationId) {
      return res.status(401).json({
        success: false,
        message: "Organization context missing",
      });
    }

    const org = await Organization.findById(req.user.organizationId);
    if (!org || !org.isActive) {
      return res.status(403).json({
        success: false,
        message: "Organization is inactive or not found",
      });
    }

    next();
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to resolve organization",
    });
  }
}

export function requireRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }
    next();
  };
}
