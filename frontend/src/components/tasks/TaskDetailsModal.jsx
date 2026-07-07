import Modal from "../common/Modal";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import AssigneeAvatar from "./AssigneeAvatar";
import Button from "../common/Button";

import {
  formatDistanceToNow,
  format,
} from "date-fns";

import {
  FiCalendar,
  FiUser,
  FiTag,
  FiPaperclip,
  FiMessageCircle,
  FiClock,
  FiEdit,
  FiTrash2,
  FiInfo,
} from "react-icons/fi";

const TaskDetailsModal = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  currentUser,
}) => {
  if (!task) return null;

  const assignedUser = task.assignedTo;
  const createdByUser = task.createdBy;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "Done";

  const canEdit =
    currentUser?.role === "Admin" ||
    currentUser?.role === "Manager" ||
    currentUser?._id === assignedUser?._id;

  const canDelete =
    currentUser?.role === "Admin" ||
    currentUser?.role === "Manager" ||
    currentUser?._id === createdByUser?._id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title=""
    >
      <div className="flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div className="min-w-0">
              <h2 className="text-2xl font-bold break-words">
                {task.title}
              </h2>

              <p className="mt-2 text-indigo-100 text-sm">
                Task Details & Activity
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>

          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">

          {/* Description */}
          {task.description && (
            <div className="bg-gray-50 border border-gray-300 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FiInfo className="text-indigo-600" />
                <h3 className="font-semibold text-gray-900">
                  Description
                </h3>
              </div>

              <p className="leading-7 text-gray-700 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Assigned */}
            <div className="border border-gray-300 rounded-2xl p-5 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FiUser className="text-indigo-600" />
                <h3 className="font-semibold">
                  Assigned To
                </h3>
              </div>

              {assignedUser ? (
                <div className="flex items-center gap-4">
                  <AssigneeAvatar
                    user={assignedUser}
                    size="lg"
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      {assignedUser.firstName}{" "}
                      {assignedUser.lastName}
                    </p>

                    {assignedUser.email && (
                      <p className="text-sm text-gray-500">
                        {assignedUser.email}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="italic text-gray-500">
                  No Assignee
                </p>
              )}
            </div>

            {/* Due Date */}
            <div className="border border-gray-300 rounded-2xl p-5 bg-white shadow-sm">

              <div className="flex items-center gap-2 mb-4">
                <FiCalendar className="text-indigo-600" />
                <h3 className="font-semibold">
                  Due Date
                </h3>
              </div>

              {task.dueDate ? (
                <>
                  <p
                    className={`font-medium ${
                      isOverdue
                        ? "text-red-600"
                        : "text-gray-800"
                    }`}
                  >
                    {format(
                      new Date(task.dueDate),
                      "PPP • p"
                    )}
                  </p>

                  <p
                    className={`mt-2 text-sm ${
                      isOverdue
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {isOverdue
                      ? `⚠ Overdue by ${formatDistanceToNow(
                          new Date(task.dueDate)
                        )}`
                      : `Due in ${formatDistanceToNow(
                          new Date(task.dueDate)
                        )}`}
                  </p>
                </>
              ) : (
                <p className="italic text-gray-500">
                  No due date
                </p>
              )}
            </div>
          </div>

          {/* Labels */}
          {task.labels?.length > 0 && (
            <div className="border rounded-2xl p-5 bg-white shadow-sm">

              <div className="flex items-center gap-2 mb-4">
                <FiTag className="text-indigo-600" />
                <h3 className="font-semibold">
                  Labels
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {task.labels.map((label, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-700 border"
                  >
                    #{label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          {task.comments?.length > 0 && (
            <div className="border rounded-2xl p-5 bg-white shadow-sm">

              <div className="flex items-center gap-2 mb-5">
                <FiMessageCircle className="text-indigo-600" />

                <h3 className="font-semibold">
                  Comments ({task.comments.length})
                </h3>
              </div>

              <div className="space-y-4">

                {task.comments.map((comment, index) => (
                  <div
                    key={index}
                    className="rounded-xl border bg-gray-50 p-4"
                  >
                    <div className="flex justify-between flex-wrap gap-2">

                      <p className="font-semibold">
                        {comment.author?.firstName}{" "}
                        {comment.author?.lastName}
                      </p>

                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(
                          new Date(comment.createdAt),
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>

                    </div>

                    <p className="mt-3 text-gray-700 leading-6">
                      {comment.text}
                    </p>
                  </div>
                ))}

              </div>
            </div>
          )}

          {/* Attachments */}
          {task.attachments?.length > 0 && (
            <div className="border rounded-2xl p-5 bg-white shadow-sm">

              <div className="flex items-center gap-2 mb-5">
                <FiPaperclip className="text-indigo-600" />

                <h3 className="font-semibold">
                  Attachments ({task.attachments.length})
                </h3>
              </div>

              <div className="grid gap-3">

                {task.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border hover:border-indigo-500 hover:bg-indigo-50 transition p-4"
                  >
                    <div className="flex items-center gap-3">

                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <FiPaperclip className="text-indigo-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {attachment.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          Click to open
                        </p>
                      </div>

                    </div>
                  </a>
                ))}

              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="rounded-2xl bg-gray-100 p-5">

            <div className="flex items-center gap-2 mb-4">
              <FiClock className="text-indigo-600" />
              <h3 className="font-semibold">
                Activity
              </h3>
            </div>

            <div className="space-y-2 text-sm text-gray-700">

              <p>
                <strong>Created By:</strong>{" "}
                {createdByUser?.firstName}{" "}
                {createdByUser?.lastName}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {format(
                  new Date(task.createdAt),
                  "PPP • p"
                )}
              </p>

              {task.updatedAt &&
                task.updatedAt !== task.createdAt && (
                  <p>
                    <strong>Updated:</strong>{" "}
                    {formatDistanceToNow(
                      new Date(task.updatedAt),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                )}

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-400 px-6 py-4">

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">

            <Button
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-auto cursor-pointer"
            >
              Close
            </Button>

            {canEdit && (
              <Button
                onClick={onEdit}
                className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiEdit />
                Edit Task
              </Button>
            )}

            {canDelete && (
              <Button
                variant="danger"
                onClick={onDelete}
                className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiTrash2 />
                Delete
              </Button>
            )}

          </div>
        </div>

      </div>
    </Modal>
  );
};

export default TaskDetailsModal;