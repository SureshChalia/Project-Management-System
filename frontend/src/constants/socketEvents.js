/**
 * Socket.IO Event Constants
 * Defines all socket events for real-time collaboration
 */

// Room Management Events
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // Room Management
  JOIN_PROJECT: "join-project",
  LEAVE_PROJECT: "leave-project",

  // Task CRUD Events
  TASK_CREATED: "task-created",
  TASK_UPDATED: "task-updated",
  TASK_DELETED: "task-deleted",
  TASK_STATUS_CHANGED: "task-status-changed",

  // User Presence Events
  USER_JOINED: "user-joined",
  USER_LEFT: "user-left",

  // Error Handling
  ERROR: "error",
};

/**
 * Task event types for internal use
 */
export const TASK_EVENT_TYPES = {
  CREATED: "created",
  UPDATED: "updated",
  DELETED: "deleted",
  STATUS_CHANGED: "statusChanged",
};

export default SOCKET_EVENTS;
