import asyncHandler from "../utils/asyncHandler.js";
import userRepository from "../repositories/user.repository.js";
import ApiResponse from "../utils/ApiResponse.js";

const search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const users = await userRepository.searchUsers(q);
  res.json(new ApiResponse(true, "Users fetched", { users }));
});

export default { search };
