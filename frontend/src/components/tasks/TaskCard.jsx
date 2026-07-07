import { formatDistanceToNow } from "date-fns";
import { FaEye, FaTrash, FaCommentDots, FaPaperclip } from "react-icons/fa";
import PriorityBadge from "./PriorityBadge";
import AssigneeAvatar from "./AssigneeAvatar";

const TaskCard = ({ task, onClick, onDelete }) => {
  const isPastDue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "Done";

  const handleView = (e) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(task._id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleView}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`
        relative group
        bg-white rounded-2xl border
        p-4
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all duration-300
        cursor-pointer
        overflow-hidden
        ${
          isPastDue
            ? "border-red-300 bg-red-50"
            : "border-gray-200 hover:border-blue-300"
        }
      `}
    >
      {/* Top Action Buttons */}
      <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleView}
          className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md cursor-pointer"
          title="View Details"
        >
          <FaEye size={14} />
        </button>

        {onDelete && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleDelete}
            className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md cursor-pointer"
            title="Delete Task"
          >
            <FaTrash size={12} />
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg text-gray-900 mb-2 pr-16 line-clamp-2 transition-colors group-hover:text-blue-600">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Priority */}
      <div className="mb-4">
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {task.assignedTo && (
            <AssigneeAvatar user={task.assignedTo} size="sm" />
          )}

          <div className="flex items-center gap-3 text-xs text-gray-500">
            {task.comments?.length > 0 && (
              <div
                className="flex items-center gap-1"
                title={`${task.comments.length} Comments`}
              >
                <FaCommentDots className="text-blue-500" />
                <span>{task.comments.length}</span>
              </div>
            )}

            {task.attachments?.length > 0 && (
              <div
                className="flex items-center gap-1"
                title={`${task.attachments.length} Attachments`}
              >
                <FaPaperclip className="text-gray-500" />
                <span>{task.attachments.length}</span>
              </div>
            )}
          </div>
        </div>

        {task.dueDate && (
          <span
            className={`text-xs font-semibold whitespace-nowrap ${
              isPastDue ? "text-red-600" : "text-gray-600"
            }`}
            title={new Date(task.dueDate).toLocaleDateString()}
          >
            {formatDistanceToNow(new Date(task.dueDate), {
              addSuffix: true,
            })}
          </span>
        )}
      </div>

      {/* Bottom Status Indicator */}
      <div
        className={`absolute bottom-0 left-0 h-1 transition-all duration-300 ${
          isPastDue
            ? "bg-red-500 w-full"
            : "bg-blue-500 w-0 group-hover:w-full"
        }`}
      />
    </div>
  );
};

export default TaskCard;