import React from "react";
import { Link } from "react-router-dom";
import {
  FaFolderOpen,
  FaUsers,
  FaEdit,
  FaTrash,
  FaArrowRight,
} from "react-icons/fa";

export default function ProjectCard({ project, onDelete, onEdit }) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Top Color Strip */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: project.color }}
      />

      <div className="p-5">
        <div className="flex flex-col lg:flex-row justify-between gap-5">
          {/* Left Section */}
          <div className="flex gap-4 flex-1 min-w-0">
            <div
              style={{ backgroundColor: project.color }}
              className="w-14 h-14 rounded-xl shadow-md flex items-center justify-center shrink-0"
            >
              <FaFolderOpen className="text-white text-2xl" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-800 wrap-break-word">
                {project.name}
              </h3>

              <p className="mt-2 text-sm text-gray-500 leading-6 wrap-break-word line-clamp-3">
                {project.description || "No description available."}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {project.status}
                </span>

                <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                  <FaUsers />
                  {project.members?.length || 0} Members
                </span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
            <Link
              to={`/projects/${project._id}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200"
            >
              Open
              <FaArrowRight size={12} />
            </Link>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onEdit?.(project)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all"
              >
                <FaEdit />
                Edit
              </button>

              <button
                onClick={() => onDelete?.(project._id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
              >
                <FaTrash />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}