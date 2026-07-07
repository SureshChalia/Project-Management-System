import React, { useEffect, useState } from "react";
import taskService from "../../services/task.service";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await taskService.getMyTasks();
        setTasks(res.data.tasks || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">My Tasks</h1>
      {loading && <p className="text-gray-600">Loading tasks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && tasks.length === 0 && (
        <p className="text-gray-600">No tasks assigned yet.</p>
      )}
      {!loading && !error && tasks.length > 0 && (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task._id} className="p-4 bg-white border rounded shadow-sm">
              <div className="flex flex-col gap-2">
                <div className="font-semibold text-gray-900">{task.title}</div>
                <div className="text-sm text-gray-600">{task.description || "No description"}</div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-slate-100 rounded">Status: {task.status}</span>
                  <span className="px-2 py-1 bg-slate-100 rounded">Priority: {task.priority || "Normal"}</span>
                  <span className="px-2 py-1 bg-slate-100 rounded">Project: {task.project?.name || "Unknown"}</span>
                  <span className="px-2 py-1 bg-slate-100 rounded">Assigned to: {task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : "Unassigned"}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
