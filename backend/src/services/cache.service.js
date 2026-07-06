import redisService from "./redis.service.js";

const TTL = {
  PROJECTS: 300,
  TASKS: 300,
  DASHBOARD: 120,
};

const keys = {
  userProjects: (userId) => `projects:${userId}`,
  projectTasks: (projectId) => `tasks:${projectId}`,
  dashboardStats: (userId) => `dashboard:${userId}`,
};

const getOrSet = async (key, ttlSeconds, producer) => {
  const cached = await redisService.getCache(key);
  if (cached !== null) {
    console.log(`Cache Hit: ${key}`);
    return cached;
  }

  console.log(`Cache Miss: ${key}`);

  const freshValue = await producer();
  await redisService.setCache(key, freshValue, ttlSeconds);
  return freshValue;
};

const getCachedUserProjects = (userId, producer) =>
  getOrSet(keys.userProjects(userId), TTL.PROJECTS, producer);

const getCachedProjectTasks = (projectId, producer) =>
  getOrSet(keys.projectTasks(projectId), TTL.TASKS, producer);

const getCachedDashboardStats = (userId, producer) =>
  getOrSet(keys.dashboardStats(userId), TTL.DASHBOARD, producer);

const getProjectUserIds = (project) => {
  if (!project) return [];

  const users = [project.owner, ...(project.members || [])]
    .map((user) => user?._id || user)
    .filter(Boolean)
    .map((userId) => userId.toString());

  return [...new Set(users)];
};

const invalidateUserCaches = async (userIds) => {
  const normalizedUserIds = [...new Set(userIds.map((id) => id?.toString()).filter(Boolean))];
  const keysToDelete = normalizedUserIds
    .flatMap((userId) => [keys.userProjects(userId), keys.dashboardStats(userId)]);

  await redisService.deleteCache(keysToDelete);
  if (keysToDelete.length > 0) {
    console.log(`Cache Invalidated: ${keysToDelete.join(", ")}`);
  }
};

const invalidateProjectCaches = async (projectId) => {
  const keysToDelete = [keys.projectTasks(projectId)];
  await redisService.deleteCache(keysToDelete);
  console.log(`Cache Invalidated: ${keysToDelete.join(", ")}`);
};

const invalidateProjectMutation = async (...projects) => {
  const projectIds = projects
    .map((project) => project?._id || project?.id)
    .filter(Boolean)
    .map((projectId) => projectId.toString());
  const userIds = projects.flatMap(getProjectUserIds);

  await Promise.all([
    invalidateUserCaches(userIds),
    ...projectIds.map((projectId) => invalidateProjectCaches(projectId)),
  ]);
};

const invalidateTaskMutation = async (project) => {
  const projectId = project?._id || project;
  const userIds = typeof project === "object" ? getProjectUserIds(project) : [];

  await Promise.all([
    projectId ? invalidateProjectCaches(projectId.toString()) : Promise.resolve(),
    invalidateUserCaches(userIds),
  ]);
};

export default {
  keys,
  TTL,
  getCachedUserProjects,
  getCachedProjectTasks,
  getCachedDashboardStats,
  invalidateUserCaches,
  invalidateProjectCaches,
  invalidateProjectMutation,
  invalidateTaskMutation,
};
