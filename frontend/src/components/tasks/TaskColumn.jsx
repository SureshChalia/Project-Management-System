import SortableTaskCard from "./SortableTaskCard";
import TaskSkeleton from "./TaskSkeleton";
import {
  useDroppable
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRef } from "react";

const TaskColumn = ({
  status,
  tasks,
  loading,
  onTaskClick,
  onTaskDelete,
  onAddTask,
}) => {
  const { setNodeRef } = useDroppable({ id: status });
  const containerRef = useRef(null);

  const statusConfig = {
    Todo: { color: "bg-gray-50", borderColor: "border-gray-300", icon: "📝" },
    "In Progress": {
      color: "bg-blue-50",
      borderColor: "border-blue-300",
      icon: "⚙️",
    },
    Done: { color: "bg-green-50", borderColor: "border-green-300", icon: "✅" },
  };

  const config = statusConfig[status] || statusConfig.Todo;

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col min-h-96 rounded-lg border-2 ${config.borderColor}
        ${config.color} p-4 backdrop-blur-sm
      `}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <h3 className="font-semibold text-gray-900">{status}</h3>
          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gray-600 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        ref={containerRef}
        className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar"
      >
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {loading ? (
            <>
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
            </>
          ) : tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-gray-500 text-center">No tasks in this column</p>
            </div>
          ) : (
            tasks.map((task) => (
              <SortableTaskCard
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task)}
                onDelete={onTaskDelete}
              />
            ))
          )}
        </SortableContext>
      </div>

      {/* Add Task Button */}
      {!loading && (
        <button
          onClick={onAddTask}
          className="mt-4 w-full py-2 px-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium text-sm"
        >
          + Add Task
        </button>
      )}
    </div>
  );
};

export default TaskColumn;
