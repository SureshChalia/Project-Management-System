import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketService from "../services/socket.service";
import {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../redux/slices/taskSlice";

/**
 * Custom hook to manage socket events and Redux state updates
 * @param {string} projectId - Current project ID
 * @param {Function} onTaskEvent - Optional callback for task events
 */
export const useSocketTaskEvents = (projectId, onTaskEvent) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.userId || user?.id;

  useEffect(() => {
    if (!projectId || !currentUserId || !socketService.getIsConnected()) {
      return;
    }

    // Join project room
    socketService.joinProject(projectId);

    // Listen for task-created event
    const handleTaskCreated = (data) => {
      const { task, createdBy } = data;

      // Don't dispatch if current user created it (already done via API)
      if (createdBy !== currentUserId) {
        dispatch(addTask({ projectId, task }));
        onTaskEvent?.({
          type: "created",
          task,
          userName: task.createdBy?.name || task.createdBy?.email,
        });
      }
    };

    // Listen for task-updated event
    const handleTaskUpdated = (data) => {
      const { task, updatedBy } = data;

      if (updatedBy !== currentUserId) {
        dispatch(updateTask({ projectId, task }));
        onTaskEvent?.({
          type: "updated",
          task,
          userName: task.updatedBy?.name || task.updatedBy?.email,
        });
      }
    };

    // Listen for task-deleted event
    const handleTaskDeleted = (data) => {
      const { taskId, deletedBy } = data;

      if (deletedBy !== currentUserId) {
        dispatch(deleteTask({ projectId, taskId }));
        onTaskEvent?.({
          type: "deleted",
          taskId,
          taskTitle: "Task",
        });
      }
    };

    // Listen for task-status-changed event
    const handleTaskStatusChanged = (data) => {
      const { taskId, status, changedBy } = data;

      if (changedBy !== currentUserId) {
        dispatch(updateTaskStatus({ projectId, taskId, status }));
        onTaskEvent?.({
          type: "statusChanged",
          taskId,
          status,
        });
      }
    };

    socketService.onTaskCreated(handleTaskCreated);
    socketService.onTaskUpdated(handleTaskUpdated);
    socketService.onTaskDeleted(handleTaskDeleted);
    socketService.onTaskStatusChanged(handleTaskStatusChanged);

    return () => {
      // Cleanup: Leave project room on unmount
      socketService.leaveProject(projectId);

      // Remove event listeners
      socketService.offEvent("task-created");
      socketService.offEvent("task-updated");
      socketService.offEvent("task-deleted");
      socketService.offEvent("task-status-changed");
    };
  }, [projectId, dispatch, currentUserId, onTaskEvent]);
};

/**
 * Custom hook to track online users in current project
 * @param {string} projectId - Current project ID
 * @returns {Object} - Object with online status and user info
 */
export const useOnlineUsers = (projectId) => {
  useEffect(() => {
    if (!projectId || !socketService.getIsConnected()) {
      return;
    }

    const handleUserJoined = (data) => {
      console.log(`User ${data.userName} joined the project`);
    };

    const handleUserLeft = (data) => {
      console.log(`User ${data.userName} left the project`);
    };

    socketService.onUserJoined(handleUserJoined);
    socketService.onUserLeft(handleUserLeft);

    return () => {
      socketService.offEvent("user-joined");
      socketService.offEvent("user-left");
    };
  }, [projectId]);
};
