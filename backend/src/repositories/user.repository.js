import User from "../models/User.js";

const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

const findByEmail = async (email) => {
  return User.findOne({ email }).select("+password");
};

const findById = async (id) => {
  return User.findById(id);
};

const searchUsers = async (query, limit = 10) => {
  if (!query) return User.find().limit(limit).select("firstName lastName email avatar");
  const q = query.trim();
  return User.find({
    $or: [
      { email: { $regex: q, $options: "i" } },
      { firstName: { $regex: q, $options: "i" } },
      { lastName: { $regex: q, $options: "i" } },
    ],
  })
    .limit(limit)
    .select("firstName lastName email avatar");
};

export default {
  createUser,
  findByEmail,
  findById,
  searchUsers,
};
