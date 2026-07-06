import taskRepository from "../repositories/task.repository.js";
import projectRepository from "../repositories/project.repository.js";
import ApiError from "../utils/ApiError.js";
import cacheService from "./cache.service.js";

// Helper: Check if user is project member
const isProjectMember = (project, userId) => {
  const userIdStr = userId.toString();
  return (
    project.owner._id.toString() === userIdStr ||
    project.members.map((m) => m._id.toString()).includes(userIdStr)
  );
};

// Helper: Check if user is project owner
const isProjectOwner = (project, userId) => {
  return project.owner._id.toString() === userId.toString();
};

const createTask = async (userId, payload) => {
  // Get project and verify membership
  const project = await projectRepository.findById(payload.project);
  if (!project) throw new ApiError(404, "Project not found");

  if (!isProjectMember(project, userId)) {
    throw new ApiError(403, "Only project members can create tasks");
  }

  // Create task with userId as createdBy
  const taskData = {
    ...payload,
    createdBy: userId,
  };

  const task = await taskRepository.createTask(taskData);
  await cacheService.invalidateTaskMutation(project);
  return task;
};

const getTasksByProject = async (userId, projectId) => {
  // Get project and verify membership
  const project = await projectRepository.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (!isProjectMember(project, userId)) {
    throw new ApiError(403, "Access denied");
  }

  return cacheService.getCachedProjectTasks(projectId, () =>
    taskRepository.findByProjectId(projectId)
  );
};

const getTaskById = async (userId, taskId) => {
  const task = await taskRepository.findById(taskId);
  if (!task) throw new ApiError(404, "Task not found");

  // Get project and verify membership
  const project = await projectRepository.findById(task.project._id);
  if (!project) throw new ApiError(404, "Project not found");

  if (!isProjectMember(project, userId)) {
    throw new ApiError(403, "Access denied");
  }

  return task;
};

const updateTask = async (userId, taskId, payload) => {
  const task = await taskRepository.findById(taskId);
  if (!task) throw new ApiError(404, "Task not found");

  // Get project and verify permissions
  const project = await projectRepository.findById(task.project._id);
  if (!project) throw new ApiError(404, "Project not found");

  if (!isProjectMember(project, userId)) {
    throw new ApiError(403, "Only project members can update tasks");
  }

  // Allow updating only these fields
  const allowedFields = [
    "title",
    "description",
    "status",
    "priority",
    "assignedTo",
    "dueDate",
    "labels",
  ];

  const updateData = {};
  for (const field of allowedFields) {
    if (field in payload) {
      updateData[field] = payload[field];
    }
  }

  const updatedTask = await taskRepository.updateTask(taskId, updateData);
  await cacheService.invalidateTaskMutation(project);
  return updatedTask;
};

const updateTaskStatus = async (userId, taskId, status) => {
  const task = await taskRepository.findById(taskId);
  if (!task) throw new ApiError(404, "Task not found");

  // Get project and verify permissions
  const project = await projectRepository.findById(task.project._id);
  if (!project) throw new ApiError(404, "Project not found");

  if (!isProjectMember(project, userId)) {
    throw new ApiError(403, "Only project members can update tasks");
  }

  const updatedTask = await taskRepository.updateTaskStatus(taskId, status);
  await cacheService.invalidateTaskMutation(project);
  return updatedTask;
};

const deleteTask = async (userId, taskId) => {
  const task = await taskRepository.findById(taskId);
  if (!task) throw new ApiError(404, "Task not found");

  // Get project and verify permissions
  const project = await projectRepository.findById(task.project._id);
  if (!project) throw new ApiError(404, "Project not found");

  if (!isProjectMember(project, userId)) {
    throw new ApiError(403, "Only project members can delete tasks");
  }

  // Only project owner or task creator can delete
  const isOwner = isProjectOwner(project, userId);
  const isCreator = task.createdBy._id.toString() === userId.toString();

  if (!isOwner && !isCreator) {
    throw new ApiError(403, "Only project owner or task creator can delete this task");
  }

  await taskRepository.deleteTask(taskId);
  await cacheService.invalidateTaskMutation(project);
  return task; // Return task object for socket emission
};

const deleteAllTasksByProject = async (userId, projectId) => {
  // Get project and verify ownership
  const project = await projectRepository.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (!isProjectOwner(project, userId)) {
    throw new ApiError(403, "Only project owner can delete all tasks");
  }

  await taskRepository.deleteTasksByProject(projectId);
  await cacheService.invalidateTaskMutation(project);
  return true;
};

const getProjectTaskStats = async (userId, projectId) => {
  // Get project and verify membership
  const project = await projectRepository.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (!isProjectMember(project, userId)) {
    throw new ApiError(403, "Access denied");
  }

  return taskRepository.getProjectTaskStats(projectId);
};

export default {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  deleteAllTasksByProject,
  getProjectTaskStats,
};
