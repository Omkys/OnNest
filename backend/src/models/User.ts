import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "owner" | "admin" | "member" | "viewer";

export interface IUser extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
  fullName: string;
}

const userSchema = new Schema<IUser>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      maxlength: 20,
      default: "",
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "member", "viewer"],
      default: "member",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete (ret as { password?: string }).password;
        delete (ret as { passwordResetToken?: string }).passwordResetToken;
        return ret;
      },
    },
  }
);

/** Multi-tenant isolation: email is unique within an organization */
userSchema.index({ organizationId: 1, email: 1 }, { unique: true });

userSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
