import React from "react";

export default function DeleteModal({ title = "Confirm", message = "Are you sure?", onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-11/12 md:w-3/4 lg:w-1/2">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2 rounded-md bg-gray-100">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="px-3 py-2 rounded-md bg-red-600 text-white disabled:opacity-60">{loading ? 'Deleting...' : 'Delete'}</button>
        </div>
      </div>
    </div>
  );
}
