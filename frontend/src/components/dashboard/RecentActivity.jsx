import React from "react";
import { FiClock } from "react-icons/fi";

export default function RecentActivity({ activities = [] }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">Recent Activity</h4>
        <div className="text-sm text-gray-500 flex items-center gap-2"><FiClock /> <span>Live</span></div>
      </div>

      <div className="space-y-3">
        {activities.length === 0 && (
          <div className="text-sm text-gray-500">No recent activity.</div>
        )}

        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">{a.actorInitials}</div>
            <div>
              <div className="text-sm text-gray-800">{a.text}</div>
              <div className="text-xs text-gray-400">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
