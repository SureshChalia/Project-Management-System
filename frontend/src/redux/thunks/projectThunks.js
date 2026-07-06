import projectService from "../../services/project.service";
import toast from "react-hot-toast";
import {
  setLoading,
  setProjects,
  addProject,
  updateProject,
  deleteProject as deleteProjectAction,
  setSelectedProject,
  clearSelectedProject,
  setError,
} from "../slices/projectSlice";

export const fetchProjects = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await projectService.getProjects();
    if (res && res.success) dispatch(setProjects(res.data.projects || []));
    else {
      dispatch(setError(res?.message || "Failed to load projects"));
      toast.error(res?.message || "Failed to load projects");
    }
  } catch (err) {
    dispatch(setError(err.message || "Failed to load projects"));
    toast.error(err.message || "Failed to load projects");
  }
};

export const createProject = (payload) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await projectService.createProject(payload);
    if (res && res.success) dispatch(addProject(res.data.project));
    else {
      dispatch(setError(res?.message || "Failed to create project"));
      toast.error(res?.message || "Failed to create project");
    }
    if (res && res.success) toast.success("Project created");
    return res;
  } catch (err) {
    dispatch(setError(err.message || "Failed to create project"));
    toast.error(err.message || "Failed to create project");
    throw err;
  }
};

export const fetchProjectById = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await projectService.getProject(id);
    if (res && res.success) dispatch(setSelectedProject(res.data.project));
    else dispatch(setError(res?.message || "Failed to load project"));
  } catch (err) {
    dispatch(setError(err.message || "Failed to load project"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateProjectById = (id, payload) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await projectService.updateProject(id, payload);
    if (res && res.success) dispatch(updateProject(res.data.project));
    else {
      dispatch(setError(res?.message || "Failed to update project"));
      toast.error(res?.message || "Failed to update project");
    }
    if (res && res.success) toast.success("Project updated");
  } catch (err) {
    dispatch(setError(err.message || "Failed to update project"));
    toast.error(err.message || "Failed to update project");
  }
};

export const deleteProjectById = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await projectService.deleteProject(id);
    if (res && res.success) dispatch(deleteProjectAction(id));
    else {
      dispatch(setError(res?.message || "Failed to delete project"));
      toast.error(res?.message || "Failed to delete project");
    }
    if (res && res.success) toast.success("Project deleted");
  } catch (err) {
    dispatch(setError(err.message || "Failed to delete project"));
    toast.error(err.message || "Failed to delete project");
  }
};

export const addMemberToProject = (projectId, userId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await projectService.addMember(projectId, userId);
    if (res && res.success) dispatch(updateProject(res.data.project));
    else {
      dispatch(setError(res?.message || "Failed to add member"));
      toast.error(res?.message || "Failed to add member");
    }
    if (res && res.success) toast.success("Member added");
  } catch (err) {
    dispatch(setError(err.message || "Failed to add member"));
    toast.error(err.message || "Failed to add member");
  }
};

export const removeMemberFromProject = (projectId, userId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await projectService.removeMember(projectId, userId);
    if (res && res.success) dispatch(updateProject(res.data.project));
    else {
      dispatch(setError(res?.message || "Failed to remove member"));
      toast.error(res?.message || "Failed to remove member");
    }
    if (res && res.success) toast.success("Member removed");
  } catch (err) {
    dispatch(setError(err.message || "Failed to remove member"));
    toast.error(err.message || "Failed to remove member");
  }
};

export const clearSelected = () => (dispatch) => {
  dispatch(clearSelectedProject());
};
