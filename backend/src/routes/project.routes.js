import { Router } from "express";
import projectController from "../controllers/project.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import projectValidator from "../validators/project.validator.js";

const router = Router();

router.use(authenticate);

router.post("/", validate(projectValidator.createProjectSchema), projectController.createProject);
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProject);
router.put("/:id", validate(projectValidator.updateProjectSchema), projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

router.post("/:id/members", validate(projectValidator.addMemberSchema), projectController.addMember);
router.delete("/:id/members/:userId", projectController.removeMember);

export default router;
