import React from "react";

export default function StatCard({ title, value, icon, className = "" }) {
  return (
    <div className={`p-4 rounded-xl shadow-sm bg-white hover:shadow-lg transform hover:-translate-y-1 transition ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
        </div>
        <div className="text-3xl text-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-lg">{icon}</div>
      </div>
    </div>
  );
}
