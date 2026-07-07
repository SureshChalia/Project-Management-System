import api from "../api/axios";
import { API } from "../api/endpoints";

const createTask = async (payload) => {
  const res = await api.post(`/api/v1${API.TASKS}`, payload);
  return res.data;
};

const getTasksByProject = async (projectId) => {
  const res = await api.get(`/api/v1${API.TASKS_BY_PROJECT(projectId)}`);
  return res.data;
};

const getTaskById = async (taskId) => {
  const res = await api.get(`/api/v1${API.TASK_DETAIL(taskId)}`);
  return res.data;
};

const updateTask = async (taskId, payload) => {
  const res = await api.put(`/api/v1${API.TASK_DETAIL(taskId)}`, payload);
  return res.data;
};

const updateTaskStatus = async (taskId, status) => {
  const res = await api.patch(`/api/v1${API.TASK_STATUS(taskId)}`, { status });
  return res.data;
};

const deleteTask = async (taskId) => {
  const res = await api.delete(`/api/v1${API.TASK_DETAIL(taskId)}`);
  return res.data;
};

const getTaskStats = async (projectId) => {
  const res = await api.get(`/api/v1${API.TASK_STATS(projectId)}`);
  return res.data;
};

const getMyTasks = async () => {
  const res = await api.get(`/api/v1${API.MY_TASKS}`);
  return res.data;
};

export default {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats,
  getMyTasks,
};
