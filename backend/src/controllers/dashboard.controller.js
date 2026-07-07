import asyncHandler from "../utils/asyncHandler.js";
import dashboardService from "../services/dashboard.service.js";
import ApiResponse from "../utils/ApiResponse.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats(req.user);
  res.json(new ApiResponse(true, "Dashboard stats fetched", { stats }));
});

export default {
  getDashboardStats,
};
