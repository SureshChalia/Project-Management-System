import React from "react";

function Avatar({ name }) {
  const initials = name ? name.split(" ").map(n => n[0]).slice(0,2).join("") : "U";
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold">{initials}</div>
  );
}

export default function OnlineMembers({ members = [] }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">Online Members</h4>
        <div className="text-sm text-gray-500">{members.length} online</div>
      </div>

      <div className="flex -space-x-3">
        {members.slice(0,6).map((m) => (
          <div key={m._id} className="border-2 border-white rounded-full">
            <Avatar name={`${m.firstName} ${m.lastName}`} />
          </div>
        ))}
        {members.length > 6 && <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm">+{members.length-6}</div>}
      </div>
    </div>
  );
}
