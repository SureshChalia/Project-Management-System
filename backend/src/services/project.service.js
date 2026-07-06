import projectRepository from "../repositories/project.repository.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import cacheService from "./cache.service.js";

const createProject = async (userId, payload) => {
  const data = { ...payload, owner: userId };
  const project = await projectRepository.createProject(data);
  await cacheService.invalidateProjectMutation(project);
  return project;
};

const getProjectsForUser = async (userId) => {
  return cacheService.getCachedUserProjects(userId, () =>
    projectRepository.findAllForUser(userId)
  );
};

const getProjectById = async (userId, projectId) => {
  const project = await projectRepository.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  const isMember = project.owner._id.toString() === userId.toString() || project.members.map((m) => m._id.toString()).includes(userId.toString());
  if (!isMember) throw new ApiError(403, "Access denied");
  return project;
};

const updateProject = async (userId, projectId, payload) => {
  const project = await projectRepository.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  if (project.owner._id.toString() !== userId.toString()) throw new ApiError(403, "Only owner can update project");
  const updated = await projectRepository.updateProject(projectId, payload);
  await cacheService.invalidateProjectMutation(project, updated);
  return updated;
};

const deleteProject = async (userId, projectId) => {
  const project = await projectRepository.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  if (project.owner._id.toString() !== userId.toString()) throw new ApiError(403, "Only owner can delete project");
  await projectRepository.deleteProject(projectId);
  await cacheService.invalidateProjectMutation(project);
  return true;
};

const addMember = async (userId, projectId, memberId) => {
  const project = await projectRepository.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  if (project.owner._id.toString() !== userId.toString()) throw new ApiError(403, "Only owner can add members");
  const user = await userRepository.findById(memberId);
  if (!user) throw new ApiError(404, "User not found");
  const updated = await projectRepository.addMember(projectId, memberId);
  await cacheService.invalidateProjectMutation(project, updated);
  return updated;
};

const removeMember = async (userId, projectId, memberId) => {
  const project = await projectRepository.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  if (project.owner._id.toString() !== userId.toString()) throw new ApiError(403, "Only owner can remove members");
  const updated = await projectRepository.removeMember(projectId, memberId);
  await cacheService.invalidateProjectMutation(project, updated);
  return updated;
};

export default {
  createProject,
  getProjectsForUser,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
