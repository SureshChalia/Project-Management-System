import asyncHandler from "../utils/asyncHandler.js";
import userRepository from "../repositories/user.repository.js";
import ApiResponse from "../utils/ApiResponse.js";

const search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const users = await userRepository.searchUsers(q);
  res.json(new ApiResponse(true, "Users fetched", { users }));
});

const list = asyncHandler(async (req, res) => {
  const users = await userRepository.findAll();
  res.json(new ApiResponse(true, "Users fetched", { users }));
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedUser = await userRepository.updateUser(id, req.body);
  if (!updatedUser) {
    return res.status(404).json(new ApiResponse(false, "User not found"));
  }
  res.json(new ApiResponse(true, "User updated", { user: updatedUser }));
});

const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedUser = await userRepository.deleteUser(id);
  if (!deletedUser) {
    return res.status(404).json(new ApiResponse(false, "User not found"));
  }
  res.json(new ApiResponse(true, "User deleted"));
});

export default { search, list, update, remove };
