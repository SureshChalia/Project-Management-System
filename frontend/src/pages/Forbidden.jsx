import React from "react";
import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow rounded-lg p-10 max-w-lg text-center">
        <h1 className="text-6xl font-bold text-red-600">403</h1>
        <h2 className="mt-4 text-2xl font-semibold">Forbidden</h2>
        <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
        <div className="mt-6">
          <Link to="/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded">Return to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
