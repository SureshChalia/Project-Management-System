import { Router } from "express";
import taskController from "../controllers/task.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import taskValidator from "../validators/task.validator.js";

const router = Router();

router.use(authenticate);

// Create a new task
router.post(
  "/",
  validate(taskValidator.createTaskSchema),
  taskController.createTask
);

// Get all tasks for a project
router.get(
  "/project/:projectId",
  taskController.getTasksByProject
);

// Get task stats for project
router.get(
  "/project/:projectId/stats",
  taskController.getProjectTaskStats
);

// Get task details
router.get(
  "/:taskId",
  taskController.getTask
);

// Update task
router.put(
  "/:taskId",
  validate(taskValidator.updateTaskSchema),
  taskController.updateTask
);

// Update task status only
router.patch(
  "/:taskId/status",
  validate(taskValidator.updateTaskStatusSchema),
  taskController.updateTaskStatus
);

// Delete a task
router.delete(
  "/:taskId",
  taskController.deleteTask
);

// Delete all tasks for a project (owner only)
router.delete(
  "/project/:projectId/all",
  taskController.deleteAllTasksByProject
);

export default router;
