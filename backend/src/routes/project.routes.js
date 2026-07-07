import { Router } from "express";
import projectController from "../controllers/project.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import projectValidator from "../validators/project.validator.js";

const router = Router();

router.use(authenticate);

router.post("/", validate(projectValidator.createProjectSchema), authorize("Admin", "Manager"), projectController.createProject);
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProject);
router.put("/:id", validate(projectValidator.updateProjectSchema), authorize("Admin", "Manager"), projectController.updateProject);
router.delete("/:id", authorize("Admin", "Manager"), projectController.deleteProject);

router.post("/:id/members", validate(projectValidator.addMemberSchema), authorize("Admin", "Manager"), projectController.addMember);
router.delete("/:id/members/:userId", authorize("Admin", "Manager"), projectController.removeMember);

export default router;
