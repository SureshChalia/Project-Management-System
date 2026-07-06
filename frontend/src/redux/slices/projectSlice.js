import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  selectedProject: null,

  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "projects",

  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setProjects: (state, action) => {
      state.projects = action.payload;
      state.loading = false;
      state.error = null;
    },

    addProject: (state, action) => {
      state.projects.unshift(action.payload);
    },

    updateProject: (state, action) => {
      state.projects = state.projects.map((project) =>
        project._id === action.payload._id ? action.payload : project
      );

      if (
        state.selectedProject &&
        state.selectedProject._id === action.payload._id
      ) {
        state.selectedProject = action.payload;
      }
    },

    deleteProject: (state, action) => {
      state.projects = state.projects.filter(
        (project) => project._id !== action.payload
      );
    },

    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },

    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },

    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearProjects: (state) => {
      state.projects = [];
      state.selectedProject = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  setSelectedProject,
  clearSelectedProject,
  setError,
  clearError,
  clearProjects,
} = projectSlice.actions;

export default projectSlice.reducer;
