import { io } from "socket.io-client";

/**
 * Socket service for real-time collaboration
 * Handles connection, authentication, room management, and event listeners
 */
class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentProjectId = null;
    this.listeners = [];
    this.connectListeners = [];
    this.disconnectListeners = [];
  }

  /**
   * Initialize socket connection with JWT token
   * @param {string} token - JWT authentication token
   * @returns {Promise<void>}
   */
  connect(token) {
    return new Promise((resolve, reject) => {
      try {
        if (this.socket?.connected) {
          console.log("Socket already connected");
          resolve();
          return;
        }

        this.socket = io(import.meta.env.VITE_SOCKET_URL, {
          auth: {
            token,
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        // Connection success
        this.socket.on("connect", () => {
          console.log("Socket connected:", this.socket.id);
          this.isConnected = true;
          this.connectListeners.forEach((callback) => {
            try {
              callback();
            } catch (err) {
              console.error("Socket connect listener error:", err);
            }
          });
          resolve();
        });

        // Connection error
        this.socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error.message);
          this.isConnected = false;
          reject(error);
        });

        // Disconnection
        this.socket.on("disconnect", (reason) => {
          console.log("Socket disconnected:", reason);
          this.isConnected = false;
          this.currentProjectId = null;
          this.disconnectListeners.forEach((callback) => {
            try {
              callback(reason);
            } catch (err) {
              console.error("Socket disconnect listener error:", err);
            }
          });
        });

        // Error handling
        this.socket.on("error", (error) => {
          console.error("Socket error:", error);
        });
      } catch (error) {
        console.error("Error initializing socket:", error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket?.connected) {
      this.socket.disconnect();
      this.isConnected = false;
      this.currentProjectId = null;
      console.log("Socket disconnected");
    }
  }

  /**
   * Join a project room
   * @param {string} projectId - Project ID to join
   */
  joinProject(projectId) {
    if (!this.socket?.connected) {
      console.warn("Socket not connected, cannot join project");
      return;
    }

    if (this.currentProjectId === projectId) {
      console.log(`Already in project room: ${projectId}`);
      return;
    }

    // Leave previous project room if any
    if (this.currentProjectId) {
      this.leaveProject(this.currentProjectId);
    }

    this.socket.emit("join-project", { projectId });
    this.currentProjectId = projectId;
    console.log(`Joined project room: ${projectId}`);
  }

  /**
   * Leave a project room
   * @param {string} projectId - Project ID to leave
   */
  leaveProject(projectId) {
    if (!this.socket?.connected) {
      console.warn("Socket not connected");
      return;
    }

    this.socket.emit("leave-project", { projectId });
    if (this.currentProjectId === projectId) {
      this.currentProjectId = null;
    }
    console.log(`Left project room: ${projectId}`);
  }

  /**
   * Subscribe to task-created event
   * @param {Function} callback - Callback function to execute
   */
  onTaskCreated(callback) {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }

    const listener = (data) => {
      console.log("Task created event received:", data);
      callback(data);
    };

    this.socket.on("task-created", listener);
    this.listeners.push({ event: "task-created", callback, listener });
  }

  /**
   * Subscribe to task-updated event
   * @param {Function} callback - Callback function to execute
   */
  onTaskUpdated(callback) {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }

    const listener = (data) => {
      console.log("Task updated event received:", data);
      callback(data);
    };

    this.socket.on("task-updated", listener);
    this.listeners.push({ event: "task-updated", callback, listener });
  }

  /**
   * Subscribe to task-deleted event
   * @param {Function} callback - Callback function to execute
   */
  onTaskDeleted(callback) {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }

    const listener = (data) => {
      console.log("Task deleted event received:", data);
      callback(data);
    };

    this.socket.on("task-deleted", listener);
    this.listeners.push({ event: "task-deleted", callback, listener });
  }

  /**
   * Subscribe to task-status-changed event
   * @param {Function} callback - Callback function to execute
   */
  onTaskStatusChanged(callback) {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }

    const listener = (data) => {
      console.log("Task status changed event received:", data);
      callback(data);
    };

    this.socket.on("task-status-changed", listener);
    this.listeners.push({ event: "task-status-changed", callback, listener });
  }

  /**
   * Subscribe to user-joined event
   * @param {Function} callback - Callback function to execute
   */
  onUserJoined(callback) {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }

    const listener = (data) => {
      console.log("User joined event received:", data);
      callback(data);
    };

    this.socket.on("user-joined", listener);
    this.listeners.push({ event: "user-joined", callback, listener });
  }

  /**
   * Subscribe to user-left event
   * @param {Function} callback - Callback function to execute
   */
  onUserLeft(callback) {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }

    const listener = (data) => {
      console.log("User left event received:", data);
      callback(data);
    };

    this.socket.on("user-left", listener);
    this.listeners.push({ event: "user-left", callback, listener });
  }

  /**
   * Unsubscribe from a specific event
   * @param {string} event - Event name
   * @param {Function} [callback] - Optional callback to remove
   */
  offEvent(event, callback) {
    if (!this.socket) return;

    if (callback) {
      const toRemove = this.listeners.filter(
        (listenerEntry) => listenerEntry.event === event && listenerEntry.callback === callback
      );

      toRemove.forEach(({ listener }) => {
        this.socket.off(event, listener);
      });

      this.listeners = this.listeners.filter(
        (listenerEntry) => !(listenerEntry.event === event && listenerEntry.callback === callback)
      );
      return;
    }

    this.socket.off(event);
    this.listeners = this.listeners.filter((l) => l.event !== event);
  }

  onConnect(callback) {
    if (typeof callback !== "function") return;
    this.connectListeners.push(callback);
    if (this.isConnected) {
      try {
        callback();
      } catch (err) {
        console.error("Socket connect listener error:", err);
      }
    }
  }

  offConnect(callback) {
    this.connectListeners = this.connectListeners.filter((cb) => cb !== callback);
  }

  onDisconnect(callback) {
    if (typeof callback !== "function") return;
    this.disconnectListeners.push(callback);
    if (!this.isConnected) {
      try {
        callback();
      } catch (err) {
        console.error("Socket disconnect listener error:", err);
      }
    }
  }

  offDisconnect(callback) {
    this.disconnectListeners = this.disconnectListeners.filter((cb) => cb !== callback);
  }

  /**
   * Unsubscribe from all events
   */
  offAll() {
    if (!this.socket) return;

    this.listeners.forEach(({ event }) => {
      this.socket.off(event);
    });
    this.listeners = [];
  }

  /**
   * Get connection status
   */
  getIsConnected() {
    return this.isConnected;
  }

  /**
   * Get current project ID
   */
  getCurrentProjectId() {
    return this.currentProjectId;
  }

  /**
   * Get socket ID
   */
  getSocketId() {
    return this.socket?.id || null;
  }
}

// Export singleton instance
export default new SocketService();
