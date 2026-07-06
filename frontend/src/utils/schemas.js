import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters").max(60),
  description: z.string().max(500).optional().or(z.literal("")),
  status: z.enum(["Active", "Archived"]).optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
});

export default { projectSchema };
