import taskRepository from "./task.repository.js";

const getDashboardStats = async (projects) => {
  const projectIds = projects.map((project) => project._id.toString());
  const memberIds = new Set();

  projects.forEach((project) => {
    if (project.owner?._id) memberIds.add(project.owner._id.toString());
    (project.members || []).forEach((member) => {
      if (member?._id) memberIds.add(member._id.toString());
    });
  });

  const taskStats =
    projectIds.length > 0
      ? await taskRepository.getDashboardTaskStats(projectIds)
      : {
          totalTasks: 0,
          todoTasks: 0,
          inProgressTasks: 0,
          doneTasks: 0,
          overdueTasks: 0,
        };

  return {
    totalProjects: projects.length,
    activeProjects: projects.filter((project) => project.status === "Active").length,
    archivedProjects: projects.filter((project) => project.status === "Archived").length,
    totalMembers: memberIds.size,
    recentProjects: projects
      .slice()
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 6),
    ...taskStats,
  };
};

export default {
  getDashboardStats,
};
