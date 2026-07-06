import Project from "../models/Project.js";
import mongoose from "mongoose";

const createProject = async (data) => {
  const project = new Project(data);
  await project.save();
  return project;
};

const findById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Project.findById(id).populate("owner members", "firstName lastName email avatar");
};

const findAllForUser = async (userId) => {
  return Project.find({ $or: [{ owner: userId }, { members: userId }] }).populate(
    "owner members",
    "firstName lastName email avatar"
  );
};

const updateProject = async (id, data) => {
  return Project.findByIdAndUpdate(id, data, { new: true }).populate(
    "owner members",
    "firstName lastName email avatar"
  );
};

const deleteProject = async (id) => {
  return Project.findByIdAndDelete(id);
};

const addMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  if (!project.members.map((m) => m.toString()).includes(userId.toString())) {
    project.members.push(userId);
    await project.save();
  }
  return Project.findById(projectId).populate("owner members", "firstName lastName email avatar");
};

const removeMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  project.members = project.members.filter((m) => m.toString() !== userId.toString());
  await project.save();
  return Project.findById(projectId).populate("owner members", "firstName lastName email avatar");
};

export default {
  createProject,
  findById,
  findAllForUser,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
