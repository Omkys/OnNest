import { NextFunction, Request, Response } from "express";
import { AuthError, getMe, signIn, signUp } from "../services/authService";
import {
  requestPasswordReset,
  resetPassword,
} from "../services/passwordResetService";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "../utils/validation";
import { env } from "../config/env";

function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = signUpSchema.parse(req.body);
    const result = await signUp(input);
    setAuthCookie(res, result.token);
    return res.status(201).json({
      success: true,
      message: "Organization and account created successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = signInSchema.parse(req.body);
    const result = await signIn(input);
    setAuthCookie(res, result.token);
    return res.status(200).json({
      success: true,
      message: "Signed in successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const data = await getMe(req.user.sub, req.user.organizationId);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("token", { path: "/" });
  return res.status(200).json({
    success: true,
    message: "Signed out successfully",
  });
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = forgotPasswordSchema.parse(req.body);
    await requestPasswordReset(input.email);
    return res.status(200).json({
      success: true,
      message:
        "If an account exists for that email, we sent a password reset link.",
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = resetPasswordSchema.parse(req.body);
    await resetPassword({
      token: input.token,
      password: input.password,
    });
    return res.status(200).json({
      success: true,
      message: "Password updated successfully. You can sign in now.",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}
