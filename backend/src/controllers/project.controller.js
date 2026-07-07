import asyncHandler from "../utils/asyncHandler.js";
import projectService from "../services/project.service.js";
import ApiResponse from "../utils/ApiResponse.js";

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.user, req.body);
  res.status(201).json(new ApiResponse(true, "Project created", { project }));
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getProjectsForUser(req.user);
  res.json(new ApiResponse(true, "Projects fetched", { projects }));
});

const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.user, req.params.id);
  res.json(new ApiResponse(true, "Project fetched", { project }));
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.user, req.params.id, req.body);
  res.json(new ApiResponse(true, "Project updated", { project }));
});

const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.user, req.params.id);
  res.json(new ApiResponse(true, "Project deleted"));
});

const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const project = await projectService.addMember(req.user, req.params.id, userId);
  res.json(new ApiResponse(true, "Member added", { project }));
});

const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const project = await projectService.removeMember(req.user, req.params.id, userId);
  res.json(new ApiResponse(true, "Member removed", { project }));
});

export default { createProject, getProjects, getProject, updateProject, deleteProject, addMember, removeMember };
