import { z } from "zod";

const title = z
  .string()
  .min(3, "Task title must be at least 3 characters")
  .max(100, "Task title must be at most 100 characters")
  .transform((s) => s.trim());

const description = z
  .string()
  .max(1000, "Description must be at most 1000 characters")
  .optional()
  .transform((s) => (s ? s.trim() : ""));

const status = z
  .enum(["Todo", "In Progress", "Done"])
  .optional();

const priority = z
  .enum(["Low", "Medium", "High", "Critical"])
  .optional();

const project = z
  .string()
  .min(1, "Project ID is required")
  .refine((id) => /^[0-9a-fA-F]{24}$/.test(id), "Invalid Project ID");

const dueDate = z
  .string()
  .datetime()
  .optional()
  .nullable();

const assignedTo = z
  .string()
  .refine((id) => /^[0-9a-fA-F]{24}$/.test(id), "Invalid User ID")
  .optional()
  .nullable();

const labels = z
  .array(z.string().max(50))
  .max(10, "Maximum 10 labels allowed")
  .optional();

export const createTaskSchema = z.object({
  title,
  description,
  project,
  status,
  priority,
  dueDate,
  assignedTo,
  labels,
});

export const updateTaskSchema = z.object({
  title: title.optional(),
  description,
  status,
  priority,
  dueDate,
  assignedTo,
  labels,
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(["Todo", "In Progress", "Done"]),
});

export default {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
};
