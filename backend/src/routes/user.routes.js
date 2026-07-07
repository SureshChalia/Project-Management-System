import { Router } from "express";
import userController from "../controllers/user.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = Router();

router.use(authenticate);

// GET /api/v1/users?q=search
router.get("/", userController.search);

// Admin-only user management
router.get("/admin", authorize("Admin"), userController.list);
router.put("/admin/:id", authorize("Admin"), userController.update);
router.delete("/admin/:id", authorize("Admin"), userController.remove);

export default router;
