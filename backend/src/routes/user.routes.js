import { Router } from "express";
import userController from "../controllers/user.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

// GET /api/v1/users?q=search
router.get("/", userController.search);

export default router;
