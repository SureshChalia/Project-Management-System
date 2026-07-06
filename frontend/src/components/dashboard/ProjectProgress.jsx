import React from "react";

function ProgressBar({ value = 0 }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div style={{ width: `${value}%` }} className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500" />
    </div>
  );
}

export default function ProjectProgress({ project, percent = 0 }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transform hover:-translate-y-1 transition">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-gray-500">{project.name}</div>
          <div className="text-xs text-gray-400">{project.members.length} members • {new Date(project.createdAt).toLocaleDateString()}</div>
        </div>
        <div className="text-sm font-semibold text-gray-800">{percent}%</div>
      </div>
      <ProgressBar value={percent} />
    </div>
  );
}
