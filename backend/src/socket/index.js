import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";
import onlineUserService from "../services/onlineUser.service.js";
import pubsubService from "../services/pubsub.service.js";

let io;
const instanceId = crypto.randomUUID();

/**
 * Initialize Socket.IO server
 * @param {http.Server} httpServer - Express server instance
 */
export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  // Middleware: Authenticate socket connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.user = decoded;

      return next();
    } catch (err) {
      console.error("Socket authentication error:", err.message);
      return next(new Error("Authentication failed"));
    }
  });

  // Connection handler
  io.on("connection", (socket) => {
    console.log(`User ${socket.user.userId} connected: ${socket.id}`);

    // Store socket connection in Redis
    onlineUserService.setOnline(socket.user.userId, socket.id);

    // Handle join-project event
    socket.on("join-project", ({ projectId }) => {
      handleJoinProject(socket, projectId);
    });

    // Handle leave-project event
    socket.on("leave-project", ({ projectId }) => {
      handleLeaveProject(socket, projectId);
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`User ${socket.user.userId} disconnected: ${socket.id}`);
      await onlineUserService.setOffline(socket.user.userId, socket.id);
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error(`Socket error for user ${socket.user.userId}:`, error);
    });
  });

  initializeSocketPubSubBridge();

  return io;
};

/**
 * Get IO instance
 */
export const getIO = () => io;

/**
 * Handle user joining a project room
 */
const handleJoinProject = (socket, projectId) => {
  if (!projectId) {
    console.warn("projectId missing in join-project event");
    return;
  }

  const room = `project-${projectId}`;
  socket.join(room);

  console.log(
    `User ${socket.user.userId} joined room ${room} (socket: ${socket.id})`
  );

  // Notify others in the room
  socket.broadcast.to(room).emit("user-joined", {
    userId: socket.user.userId,
    userName: socket.user.userName || socket.user.email,
    timestamp: new Date(),
  });
};

/**
 * Handle user leaving a project room
 */
const handleLeaveProject = (socket, projectId) => {
  if (!projectId) {
    console.warn("projectId missing in leave-project event");
    return;
  }

  const room = `project-${projectId}`;
  socket.leave(room);

  console.log(
    `User ${socket.user.userId} left room ${room} (socket: ${socket.id})`
  );

  // Notify others in the room
  socket.broadcast.to(room).emit("user-left", {
    userId: socket.user.userId,
    userName: socket.user.userName || socket.user.email,
    timestamp: new Date(),
  });
};

/**
 * Emit task created event to project room
 */
export const emitTaskCreated = (projectId, task, userId) => {
  if (!io) return;

  const room = `project-${projectId}`;
  const payload = {
    task,
    createdBy: userId,
    timestamp: new Date(),
  };

  io.to(room).emit("task-created", payload);
  pubsubService.publishSocketEvent({
    event: "task-created",
    room,
    payload,
    origin: instanceId,
  });

  console.log(`Task created event emitted to room ${room}`);
};

/**
 * Emit task updated event to project room
 */
export const emitTaskUpdated = (projectId, task, userId) => {
  if (!io) return;

  const room = `project-${projectId}`;
  const payload = {
    task,
    updatedBy: userId,
    timestamp: new Date(),
  };

  io.to(room).emit("task-updated", payload);
  pubsubService.publishSocketEvent({
    event: "task-updated",
    room,
    payload,
    origin: instanceId,
  });

  console.log(`Task updated event emitted to room ${room}`);
};

/**
 * Emit task deleted event to project room
 */
export const emitTaskDeleted = (projectId, taskId, userId) => {
  if (!io) return;

  const room = `project-${projectId}`;
  const payload = {
    taskId,
    deletedBy: userId,
    timestamp: new Date(),
  };

  io.to(room).emit("task-deleted", payload);
  pubsubService.publishSocketEvent({
    event: "task-deleted",
    room,
    payload,
    origin: instanceId,
  });

  console.log(`Task deleted event emitted to room ${room}`);
};

/**
 * Emit task status changed event to project room
 */
export const emitTaskStatusChanged = (projectId, taskId, status, userId) => {
  if (!io) return;

  const room = `project-${projectId}`;
  const payload = {
    taskId,
    status,
    changedBy: userId,
    timestamp: new Date(),
  };

  io.to(room).emit("task-status-changed", payload);
  pubsubService.publishSocketEvent({
    event: "task-status-changed",
    room,
    payload,
    origin: instanceId,
  });

  console.log(`Task status changed event emitted to room ${room}`);
};

/**
 * Get all online users in a project room
 */
export const getOnlineUsersInProject = async (projectId) => {
  if (!io) return [];

  const room = `project-${projectId}`;
  const sockets = await io.in(room).fetchSockets();

  return sockets.map((socket) => ({
    userId: socket.user.userId,
    userName: socket.user.userName || socket.user.email,
    socketId: socket.id,
  }));
};

/**
 * Get user socket from Redis
 */
export const getUserSocket = async (userId) => {
  return onlineUserService.getSocketId(userId);
};

const initializeSocketPubSubBridge = () => {
  pubsubService.subscribe(pubsubService.CHANNELS.SOCKET_EVENT, (message) => {
    if (!io || message.origin === instanceId) return;
    if (!message.room || !message.event) return;

    io.to(message.room).emit(message.event, message.payload);
  });
};
