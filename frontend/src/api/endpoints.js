export const API = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  PROJECTS: "/projects",

  TASKS: "/tasks",
  MY_TASKS: "/tasks/me",
  TASKS_BY_PROJECT: (projectId) => `/tasks/project/${projectId}`,
  TASK_STATS: (projectId) => `/tasks/project/${projectId}/stats`,
  TASK_DETAIL: (taskId) => `/tasks/${taskId}`,
  TASK_STATUS: (taskId) => `/tasks/${taskId}/status`,
};