import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    owner: { type: Types.ObjectId, ref: "User", required: true },
    members: [{ type: Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["Active", "Archived"], default: "Active" },
    color: { type: String, trim: true, default: "#6b7280" },
  },
  { timestamps: true }
);

// Ensure owner is always a member
projectSchema.pre("save", function () {
  if (!this.members) this.members = [];
  const ownerId = this.owner && this.owner.toString ? this.owner.toString() : null;
  if (ownerId && !this.members.map((m) => m.toString()).includes(ownerId)) {
    this.members.push(this.owner);
  }
});

const Project = model("Project", projectSchema);

export default Project;
