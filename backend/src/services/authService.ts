import mongoose from "mongoose";
import { Organization } from "../models/Organization";
import { User } from "../models/User";
import { SignInInput, SignUpInput } from "../utils/validation";
import { generateOrganizationId, generateUniqueSlug } from "../utils/slug";
import { signToken } from "../utils/jwt";
import { getIO } from "../sockets";

export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function buildAuthResponse(
  user: InstanceType<typeof User>,
  org: InstanceType<typeof Organization>
) {
  const token = signToken({
    sub: user._id.toString(),
    organizationId: org._id.toString(),
    organizationPublicId: org.organizationId,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      fullName: `${user.firstName} ${user.lastName}`,
    },
    organization: {
      id: org._id.toString(),
      organizationId: org.organizationId,
      name: org.name,
      slug: org.slug,
      plan: org.plan,
    },
  };
}

async function emitSignupEvents(organization: InstanceType<typeof Organization>) {
  try {
    const io = getIO();
    io.to(`org:${organization._id.toString()}`).emit("organization:created", {
      organizationId: organization.organizationId,
      name: organization.name,
      at: new Date().toISOString(),
    });
    io.emit("tenant:activity", {
      type: "signup",
      organizationId: organization.organizationId,
      at: new Date().toISOString(),
    });
  } catch {
    // Socket may not be ready during early boot; ignore
  }
}

function buildUserPayload(input: SignUpInput, organizationId: mongoose.Types.ObjectId) {
  return {
    organizationId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email.toLowerCase(),
    phoneNumber: input.phoneNumber.trim(),
    password: input.password,
    role: "owner" as const,
    isActive: true,
  };
}

export async function signUp(input: SignUpInput) {
  const existingGlobalOwnerEmail = await User.findOne({
    email: input.email.toLowerCase(),
    role: "owner",
  });

  if (existingGlobalOwnerEmail) {
    throw new AuthError(
      "An organization owner with this email already exists. Sign in instead.",
      409
    );
  }

  const useTransaction = mongoose.connection.readyState === 1;

  if (useTransaction) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const organization = new Organization({
        name: input.organizationName,
        slug: generateUniqueSlug(input.organizationName),
        organizationId: generateOrganizationId(),
        plan: "free",
        isActive: true,
      });

      await organization.save({ session });

      const user = new User(buildUserPayload(input, organization._id));
      await user.save({ session });

      organization.ownerId = user._id;
      await organization.save({ session });

      await session.commitTransaction();
      await emitSignupEvents(organization);
      return buildAuthResponse(user, organization);
    } catch (error) {
      await session.abortTransaction().catch(() => undefined);

      const message = error instanceof Error ? error.message : "";
      if (!message.includes("Transaction numbers are only allowed")) {
        throw error;
      }
    } finally {
      session.endSession();
    }
  }

  const organization = await Organization.create({
    name: input.organizationName,
    slug: generateUniqueSlug(input.organizationName),
    organizationId: generateOrganizationId(),
    plan: "free",
    isActive: true,
  });

  try {
    const user = await User.create(buildUserPayload(input, organization._id));
    organization.ownerId = user._id;
    await organization.save();
    await emitSignupEvents(organization);
    return buildAuthResponse(user, organization);
  } catch (error) {
    await Organization.findByIdAndDelete(organization._id);
    throw error;
  }
}

export async function signIn(input: SignInInput) {
  const email = input.email.toLowerCase();

  const matches = await User.find({ email, isActive: true })
    .select("+password")
    .sort({ lastLoginAt: -1, createdAt: -1 });

  if (matches.length === 0) {
    throw new AuthError("Invalid email or password", 401);
  }

  let authenticated = null as (typeof matches)[number] | null;

  for (const candidate of matches) {
    const valid = await candidate.comparePassword(input.password);
    if (valid) {
      authenticated = candidate;
      break;
    }
  }

  if (!authenticated) {
    throw new AuthError("Invalid email or password", 401);
  }

  const org = await Organization.findById(authenticated.organizationId);
  if (!org || !org.isActive) {
    throw new AuthError("Organization is inactive or not found", 403);
  }

  authenticated.lastLoginAt = new Date();
  await authenticated.save();

  const result = buildAuthResponse(authenticated, org);

  try {
    const io = getIO();
    io.to(`org:${org._id.toString()}`).emit("user:signed_in", {
      userId: authenticated._id.toString(),
      email: authenticated.email,
      organizationId: org.organizationId,
      at: new Date().toISOString(),
    });
  } catch {
    // ignore
  }

  return result;
}

export async function getMe(userId: string, organizationId: string) {
  const user = await User.findOne({
    _id: userId,
    organizationId,
    isActive: true,
  });

  if (!user) {
    throw new AuthError("User not found", 404);
  }

  const org = await Organization.findById(organizationId);
  if (!org || !org.isActive) {
    throw new AuthError("Organization not found", 404);
  }

  return {
    user: {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      fullName: `${user.firstName} ${user.lastName}`,
    },
    organization: {
      id: org._id.toString(),
      organizationId: org.organizationId,
      name: org.name,
      slug: org.slug,
      plan: org.plan,
    },
  };
}
