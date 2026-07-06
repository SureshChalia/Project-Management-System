import asyncHandler from "../utils/asyncHandler.js";
import taskService from "../services/task.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  emitTaskCreated,
  emitTaskUpdated,
  emitTaskDeleted,
  emitTaskStatusChanged,
} from "../socket/index.js";

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user.userId, req.body);

  // Emit socket event to project room
  emitTaskCreated(task.project._id, task, req.user.userId);

  res.status(201).json(new ApiResponse(true, "Task created", { task }));
});

const getTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const tasks = await taskService.getTasksByProject(req.user.userId, projectId);
  res.json(new ApiResponse(true, "Tasks fetched", { tasks }));
});

const getTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await taskService.getTaskById(req.user.userId, taskId);
  res.json(new ApiResponse(true, "Task fetched", { task }));
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await taskService.updateTask(req.user.userId, taskId, req.body);

  // Emit socket event to project room
  emitTaskUpdated(task.project._id, task, req.user.userId);

  res.json(new ApiResponse(true, "Task updated", { task }));
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const task = await taskService.updateTaskStatus(req.user.userId, taskId, status);

  // Emit socket event to project room
  emitTaskStatusChanged(task.project._id, taskId, status, req.user.userId);

  res.json(new ApiResponse(true, "Task status updated", { task }));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await taskService.deleteTask(req.user.userId, taskId);

  // Emit socket event to project room
  emitTaskDeleted(task.project._id, taskId, req.user.userId);

  res.json(new ApiResponse(true, "Task deleted"));
});

const deleteAllTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  await taskService.deleteAllTasksByProject(req.user.userId, projectId);
  res.json(new ApiResponse(true, "All project tasks deleted"));
});

const getProjectTaskStats = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const stats = await taskService.getProjectTaskStats(req.user.userId, projectId);
  res.json(new ApiResponse(true, "Task stats fetched", { stats }));
});

export default {
  createTask,
  getTasksByProject,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  deleteAllTasksByProject,
  getProjectTaskStats,
};
