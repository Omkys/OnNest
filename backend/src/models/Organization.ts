import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrganization extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  organizationId: string;
  ownerId?: Types.ObjectId;
  plan: "free" | "starter" | "pro" | "enterprise";
  isActive: boolean;
  settings: {
    allowMemberSignup: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    organizationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    plan: {
      type: String,
      enum: ["free", "starter", "pro", "enterprise"],
      default: "free",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      allowMemberSignup: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>(
  "Organization",
  organizationSchema
);
