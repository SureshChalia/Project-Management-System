import Modal from "../common/Modal";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import AssigneeAvatar from "./AssigneeAvatar";
import Button from "../common/Button";
import { formatDistanceToNow, format } from "date-fns";

const TaskDetailsModal = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  projectMembers,
  currentUser,
}) => {
  if (!task) return null;

  const assignedUser = task.assignedTo;
  const createdByUser = task.createdBy;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Done";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title} size="lg">
      <div className="space-y-6 max-h-96 overflow-y-auto">
        {/* Description */}
        {task.description && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          </div>
        )}

        {/* Status and Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
            <StatusBadge status={task.status} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Priority</h4>
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        {/* Assignment */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Assigned To</h4>
          {assignedUser ? (
            <div className="flex items-center gap-2">
              <AssigneeAvatar user={assignedUser} size="md" />
              <span className="text-gray-700">
                {assignedUser.firstName} {assignedUser.lastName}
              </span>
            </div>
          ) : (
            <span className="text-gray-500 italic">Unassigned</span>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Due Date</h4>
            <div
              className={`text-sm ${
                isOverdue ? "text-red-600 font-semibold" : "text-gray-700"
              }`}
            >
              <p>{format(new Date(task.dueDate), "PPpp")}</p>
              <p className="text-xs text-gray-600 mt-1">
                {isOverdue ? "⚠️ Overdue by " : "Due in "}
                {formatDistanceToNow(new Date(task.dueDate))}
              </p>
            </div>
          </div>
        )}

        {/* Labels */}
        {task.labels && task.labels.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Labels</h4>
            <div className="flex flex-wrap gap-2">
              {task.labels.map((label, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full border border-purple-200"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        {task.comments && task.comments.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Comments ({task.comments.length})
            </h4>
            <div className="space-y-3 bg-gray-50 rounded-lg p-3">
              {task.comments.map((comment, idx) => (
                <div key={idx} className="text-sm">
                  <p className="font-medium text-gray-900">
                    {comment.author?.firstName} {comment.author?.lastName}
                  </p>
                  <p className="text-gray-700 mt-1">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {task.attachments && task.attachments.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Attachments ({task.attachments.length})
            </h4>
            <div className="space-y-2">
              {task.attachments.map((attachment, idx) => (
                <a
                  key={idx}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="text-blue-600">📎</span>
                  <span className="text-sm text-blue-600 hover:underline truncate">
                    {attachment.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-1">
          <p>
            Created by {createdByUser?.firstName} {createdByUser?.lastName}{" "}
            {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
          </p>
          {task.updatedAt && task.updatedAt !== task.createdAt && (
            <p>
              Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            Edit
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailsModal;
