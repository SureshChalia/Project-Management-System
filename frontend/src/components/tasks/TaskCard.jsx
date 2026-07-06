import { formatDistanceToNow } from "date-fns";
import PriorityBadge from "./PriorityBadge";
import AssigneeAvatar from "./AssigneeAvatar";

const TaskCard = ({ task, onClick, onDelete }) => {
  const isDueSoon = task.dueDate && new Date(task.dueDate) < new Date();
  const isOverdue = isDueSoon && task.status !== "Done";

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg p-4 border border-gray-200 shadow-sm
        hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer
        group relative overflow-hidden
        ${isOverdue ? "border-red-300 bg-red-50" : ""}
      `}
    >
      {/* Title */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Priority Badge */}
      <div className="mb-3">
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        {/* Assignee & Meta */}
        <div className="flex items-center gap-2">
          {task.assignedTo && (
            <AssigneeAvatar user={task.assignedTo} size="sm" />
          )}
          <div className="flex gap-1 text-xs text-gray-500">
            {task.comments?.length > 0 && (
              <span title="Comments">💬 {task.comments.length}</span>
            )}
            {task.attachments?.length > 0 && (
              <span title="Attachments">📎 {task.attachments.length}</span>
            )}
          </div>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <span
            className={`text-xs font-medium ${
              isOverdue ? "text-red-600" : "text-gray-600"
            }`}
            title={new Date(task.dueDate).toLocaleDateString()}
          >
            {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
          </span>
        )}
      </div>

      {/* Delete Button (visible on hover) */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded p-1 hover:bg-red-600 transition-all"
          title="Delete task"
        >
          ✕
        </button>
      )}

      {/* Overdue Indicator */}
      {isOverdue && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-400"></div>
      )}
    </div>
  );
};

export default TaskCard;
