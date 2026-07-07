import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaFolderOpen,
  FaUsers,
  FaEdit,
  FaTrash,
  FaArrowRight,
} from "react-icons/fa";

export default function ProjectCard({ project, onDelete, onEdit }) {
  const user = useSelector((state) => state.auth.user);

  const role = user?.role;
  const userId = user?.userId || user?._id;

  const isOwner =
    project?.owner?._id === userId ||
    project?.owner?._id === user?._id;

  return (
    <div className="group h-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Top Color */}
      <div
        className="h-2 w-full"
        style={{
          backgroundColor: project?.color || "#6366F1",
        }}
      />

      <div className="flex flex-col justify-between flex-1 p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md"
            style={{
              backgroundColor: project?.color || "#6366F1",
            }}
          >
            <FaFolderOpen className="text-white text-2xl" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h2
              className="text-lg sm:text-xl font-bold text-gray-800 truncate"
              title={project?.name}
            >
              {project?.name}
            </h2>

            <p className="mt-2 text-sm text-gray-500 leading-6 line-clamp-3">
              {project?.description || "No description available."}
            </p>

            {/* Status */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${project?.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
                  }`}
              >
                {project?.status}
              </span>

              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-600">
                <FaUsers />
                {project?.members?.length || 0} Members
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Open Project Button */}
          <Link
            to={`/projects/${project?._id}`}
            className="group inline-flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            Open Project
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {(role === "Admin" || (role === "Manager" && isOwner)) && (
            <div className="flex items-center justify-end gap-3">
              {/* Edit */}
              <button
                onClick={() => onEdit?.(project)}
                className="group h-11 w-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-300 shadow-sm hover:shadow-md"
                title="Edit Project"
              >
                <FaEdit className="mx-auto transition-transform duration-300 group-hover:scale-110" />
              </button>

              {/* Delete */}
              <button
                onClick={() => onDelete?.(project?._id)}
                className="group h-11 w-11 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 shadow-sm hover:shadow-md"
                title="Delete Project"
              >
                <FaTrash className="mx-auto transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}