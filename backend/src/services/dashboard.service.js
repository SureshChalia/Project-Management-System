import projectRepository from "../repositories/project.repository.js";
import dashboardRepository from "../repositories/dashboard.repository.js";
import cacheService from "./cache.service.js";

const getDashboardStats = async (userId) =>
  cacheService.getCachedDashboardStats(userId, async () => {
    const projects = await projectRepository.findAllForUser(userId);
    return dashboardRepository.getDashboardStats(projects);
  });

export default {
  getDashboardStats,
};
