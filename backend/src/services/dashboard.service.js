import projectRepository from "../repositories/project.repository.js";
import dashboardRepository from "../repositories/dashboard.repository.js";
import cacheService from "./cache.service.js";
import onlineUserService from "./onlineUser.service.js";
import userRepository from "../repositories/user.repository.js";

const getDashboardStats = async (user) =>
  cacheService.getCachedDashboardStats(user.userId, async () => {
    const projects =
      user.role === "Admin"
        ? await projectRepository.findAll()
        : await projectRepository.findAllForUser(user.userId);

    const stats = await dashboardRepository.getDashboardStats(projects);

    // Add total users count for Admin
    if (user.role === "Admin") {
      const totalUsers = await userRepository.countUsers();
      const onlineUsers = await onlineUserService.countOnlineUsers();
      return { ...stats, totalUsers, onlineUsers };
    }

    return stats;
  });

export default {
  getDashboardStats,
};
