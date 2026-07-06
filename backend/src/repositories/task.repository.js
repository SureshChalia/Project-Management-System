import Task from "../models/Task.js";
import mongoose from "mongoose";

const createTask = async (data) => {
  const task = new Task(data);
  await task.save();
  return task.populate(["project", "assignedTo", "createdBy", "comments.author"]);
};

const findById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Task.findById(id).populate([
    "project",
    "assignedTo",
    "createdBy",
    "comments.author",
  ]);
};

const findByProjectId = async (projectId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) return [];
  return Task.find({ project: projectId })
    .populate(["project", "assignedTo", "createdBy"])
    .sort({ createdAt: -1 });
};

const updateTask = async (id, data) => {
  return Task.findByIdAndUpdate(id, data, { new: true }).populate([
    "project",
    "assignedTo",
    "createdBy",
    "comments.author",
  ]);
};

const deleteTask = async (id) => {
  return Task.findByIdAndDelete(id);
};

const updateTaskStatus = async (id, status) => {
  return Task.findByIdAndUpdate(id, { status }, { new: true }).populate([
    "project",
    "assignedTo",
    "createdBy",
  ]);
};

const deleteTasksByProject = async (projectId) => {
  return Task.deleteMany({ project: projectId });
};

const getProjectTaskStats = async (projectId) => {
  const stats = await Task.aggregate([
    { $match: { project: new mongoose.Types.ObjectId(projectId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  return stats;
};

const getDashboardTaskStats = async (projectIds) => {
  const objectIds = projectIds.map((projectId) => new mongoose.Types.ObjectId(projectId));

  const [statusCounts, overdueCount] = await Promise.all([
    Task.aggregate([
      { $match: { project: { $in: objectIds } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
    Task.countDocuments({
      project: { $in: objectIds },
      status: { $ne: "Done" },
      dueDate: { $lt: new Date() },
    }),
  ]);

  const byStatus = statusCounts.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  return {
    totalTasks: statusCounts.reduce((sum, item) => sum + item.count, 0),
    todoTasks: byStatus.Todo || 0,
    inProgressTasks: byStatus["In Progress"] || 0,
    doneTasks: byStatus.Done || 0,
    overdueTasks: overdueCount,
  };
};

export default {
  createTask,
  findById,
  findByProjectId,
  updateTask,
  deleteTask,
  updateTaskStatus,
  deleteTasksByProject,
  getProjectTaskStats,
  getDashboardTaskStats,
};
