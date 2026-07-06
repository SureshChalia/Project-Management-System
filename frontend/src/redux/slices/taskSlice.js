import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasksByProject: {}, // { projectId: [tasks] }
  selectedTask: null,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",

  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set tasks for a specific project
    setTasks: (state, action) => {
      const { projectId, tasks } = action.payload;
      state.tasksByProject[projectId] = tasks;
      state.loading = false;
      state.error = null;
    },

    // Add a new task to a project
    addTask: (state, action) => {
      const { projectId, task } = action.payload;
      if (!state.tasksByProject[projectId]) {
        state.tasksByProject[projectId] = [];
      }
      state.tasksByProject[projectId].unshift(task);
    },

    // Update an existing task
    updateTask: (state, action) => {
      const { projectId, task } = action.payload;
      if (state.tasksByProject[projectId]) {
        state.tasksByProject[projectId] = state.tasksByProject[projectId].map((t) =>
          t._id === task._id ? task : t
        );
      }
      if (state.selectedTask?._id === task._id) {
        state.selectedTask = task;
      }
    },

    // Delete a task
    deleteTask: (state, action) => {
      const { projectId, taskId } = action.payload;
      if (state.tasksByProject[projectId]) {
        state.tasksByProject[projectId] = state.tasksByProject[projectId].filter(
          (t) => t._id !== taskId
        );
      }
      if (state.selectedTask?._id === taskId) {
        state.selectedTask = null;
      }
    },

    // Update only task status
    updateTaskStatus: (state, action) => {
      const { projectId, taskId, status } = action.payload;
      if (state.tasksByProject[projectId]) {
        const task = state.tasksByProject[projectId].find((t) => t._id === taskId);
        if (task) {
          task.status = status;
        }
      }
      if (state.selectedTask?._id === taskId) {
        state.selectedTask = { ...state.selectedTask, status };
      }
    },

    // Set selected task for detail view
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },

    // Clear selected task
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },

    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Clear all tasks (when switching projects)
    clearTasks: (state) => {
      state.tasksByProject = {};
      state.selectedTask = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  setSelectedTask,
  clearSelectedTask,
  setError,
  clearError,
  clearTasks,
} = taskSlice.actions;

export default taskSlice.reducer;