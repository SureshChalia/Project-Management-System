import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar({ open = true, onClose }) {
  const user = useSelector((s) => s.auth.user);
  const role = user?.role;
  return (
    <div className={`bg-white border-r ${open ? "w-64" : "w-16"} border-gray-300 transition-all h-full fixed md:relative z-40`}> 
      <div className="px-4 py-5 flex items-center justify-between border-b border-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center font-bold">PM</div>
          <div className="hidden md:block font-semibold">Project Manager</div>
        </div>
        <div className="md:hidden">
          <button onClick={onClose} className="text-sm">✕</button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        <NavLink to="/dashboard" className={({isActive}) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
          Dashboard
        </NavLink>
        {role !== 'Member' && (
          <NavLink to="/projects" className={({isActive}) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
            Projects
          </NavLink>
        )}

        {role === 'Admin' && (
          <>
            <NavLink to="/users" className={({isActive}) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
              Users
            </NavLink>
            <NavLink to="/settings" className={({isActive}) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
              Settings
            </NavLink>
          </>
        )}

        {role === 'Member' && (
          <NavLink to="/my-tasks" className={({isActive}) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
            My Tasks
          </NavLink>
        )}
      </nav>
    </div>
  );
}
