import asyncHandler from "../utils/asyncHandler.js";
import authService from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  res.status(201).json(new ApiResponse(true, "Registration successful", { user, token }));
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  res.json(new ApiResponse(true, "Login successful", { user, token }));
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.userId);
  res.json(new ApiResponse(true, "User fetched", { user }));
});

export default { register, login, me };
