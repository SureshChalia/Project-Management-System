import api from "../api/axios";

const createProject = async (payload) => {
  const res = await api.post(`/api/v1/projects`, payload);
  return res.data;
};

const getProjects = async () => {
  const res = await api.get(`/api/v1/projects`);
  return res.data;
};

const getProject = async (id) => {
  const res = await api.get(`/api/v1/projects/${id}`);
  return res.data;
};

const updateProject = async (id, payload) => {
  const res = await api.put(`/api/v1/projects/${id}`, payload);
  return res.data;
};

const deleteProject = async (id) => {
  const res = await api.delete(`/api/v1/projects/${id}`);
  return res.data;
};

const addMember = async (projectId, userId) => {
  const res = await api.post(`/api/v1/projects/${projectId}/members`, { userId });
  return res.data;
};

const removeMember = async (projectId, userId) => {
  const res = await api.delete(`/api/v1/projects/${projectId}/members/${userId}`);
  return res.data;
};

export default {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
