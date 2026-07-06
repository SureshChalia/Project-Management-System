import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String },
    role: { type: String, enum: ["Admin", "Manager", "Member"], default: "Member" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
