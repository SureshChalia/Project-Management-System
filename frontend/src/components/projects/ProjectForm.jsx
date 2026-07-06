import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "../../utils/schemas";
import Button from "../common/Button";

export default function ProjectForm({ initialValues = {}, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(projectSchema), defaultValues: initialValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Project Name</label>
        <input {...register("name")} placeholder="e.g. Website Redesign" className={`w-full rounded-md border px-3 py-2 mt-1 shadow-sm ${errors.name ? "border-red-500" : "border-gray-200"}`} />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea {...register("description")} rows={4} placeholder="Short project description" className={`w-full rounded-md border px-3 py-2 mt-1 shadow-sm ${errors.description ? "border-red-500" : "border-gray-200"}`} />
        {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <input type="color" {...register("color")} className="mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select {...register("status")} className="w-full mt-1 rounded-md border px-2 py-2 shadow-sm">
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>Save project</Button>
      </div>
    </form>
  );
}
