import projectRepository from "../repositories/project.repository.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import cacheService from "./cache.service.js";

const createProject = async (user, payload) => {
  const userId = user.userId;
  const data = { ...payload, owner: userId };
  const project = await projectRepository.createProject(data);
  await cacheService.invalidateProjectMutation(project);
  return project;
};

const getProjectsForUser = async (user) => {
  const userId = user.userId;
  if (user.role === "Admin") {
    return cacheService.getCachedUserProjects(userId, () => projectRepository.findAll());
  }
  return cacheService.getCachedUserProjects(userId, () =>
    projectRepository.findAllForUser(userId)
  );
};

const getProjectById = async (user, projectId) => {
  const userId = user.userId;
  const project = await projectRepository.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // Admins can access any project
  if (user.role === "Admin") return project;

  const isMember = project.owner._id.toString() === userId.toString() || project.members.map((m) => m._id.toString()).includes(userId.toString());
  if (!isMember) throw new ApiError(403, "Access denied");
  return project;
};

const updateProject = async (user, projectId, payload) => {
  const userId = user.userId;
  const project = await projectRepository.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  if (user.role !== "Admin" && project.owner._id.toString() !== userId.toString()) throw new ApiError(403, "Only owner can update project");
  const updated = await projectRepository.updateProject(projectId, payload);
  await cacheService.invalidateProjectMutation(project, updated);
  return updated;
};

const deleteProject = async (user, projectId) => {
  const userId = user.userId;
  const project = await projectRepository.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  if (user.role !== "Admin" && project.owner._id.toString() !== userId.toString()) throw new ApiError(403, "Only owner can delete project");
  await projectRepository.deleteProject(projectId);
  await cacheService.invalidateProjectMutation(project);
  return true;
};

const addMember = async (user, projectId, memberId) => {
  const userId = user.userId;
  const project = await projectRepository.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  if (user.role !== "Admin" && project.owner._id.toString() !== userId.toString()) throw new ApiError(403, "Only owner can add members");
  const userToAdd = await userRepository.findById(memberId);
  if (!userToAdd) throw new ApiError(404, "User not found");
  const updated = await projectRepository.addMember(projectId, memberId);
  await cacheService.invalidateProjectMutation(project, updated);
  return updated;
};

const removeMember = async (user, projectId, memberId) => {
  const userId = user.userId;
  const project = await projectRepository.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  if (user.role !== "Admin" && project.owner._id.toString() !== userId.toString()) throw new ApiError(403, "Only owner can remove members");
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
