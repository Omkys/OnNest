import crypto from "crypto";
import { User } from "../models/User";
import { Organization } from "../models/Organization";
import { env } from "../config/env";
import { sendPasswordResetEmail } from "./mailService";
import { AuthError } from "./authService";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(email: string): Promise<void> {
  const normalized = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalized, isActive: true }).sort({
    lastLoginAt: -1,
    createdAt: -1,
  });

  // Always succeed from the caller's perspective to avoid email enumeration
  if (!user) return;

  const org = await Organization.findById(user.organizationId);
  if (!org || !org.isActive) return;

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashed = hashToken(rawToken);
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        passwordResetToken: hashed,
        passwordResetExpires: expires,
      },
    }
  );

  const resetUrl = `${env.CLIENT_ORIGIN}/reset-password?token=${rawToken}`;

  try {
    await sendPasswordResetEmail({
      to: user.email,
      firstName: user.firstName,
      resetUrl,
    });
  } catch (error) {
    // Do not expose mail/config details to clients
    console.error("Failed to send password reset email");
    if (env.NODE_ENV === "development") {
      console.error(error instanceof Error ? error.message : "unknown mail error");
    }
  }
}

export async function resetPassword(input: {
  token: string;
  password: string;
}): Promise<void> {
  const hashed = hashToken(input.token);

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
    isActive: true,
  }).select("+passwordResetToken +passwordResetExpires +password");

  if (!user) {
    throw new AuthError("This reset link is invalid or has expired", 400);
  }

  user.password = input.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
}
