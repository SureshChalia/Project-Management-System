import { z } from "zod";

const name = z.string().min(3, "Project name must be at least 3 characters").max(60, "Project name must be at most 60 characters").transform((s) => s.trim());
const description = z.string().max(500, "Description must be at most 500 characters").optional().transform((s) => (s ? s.trim() : ""));
const status = z.enum(["Active", "Archived"]).optional();
const color = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color hex").optional();

export const createProjectSchema = z.object({
  name,
  description,
  status,
  color,
});

export const updateProjectSchema = z.object({
  name: name.optional(),
  description,
  status,
  color,
});

export const addMemberSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export default { createProjectSchema, updateProjectSchema, addMemberSchema };
