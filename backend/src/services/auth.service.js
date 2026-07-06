import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";
import { env } from "../config/env.js";
import ApiError from "../utils/ApiError.js";

const generateToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
};

const register = async ({ firstName, lastName, email, password }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new ApiError(400, "Email already registered");
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await userRepository.createUser({
    firstName,
    lastName,
    email,
    password: hashed,
  });

  const token = generateToken(user);

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new ApiError(400, "Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(400, "Invalid credentials");

  const token = generateToken(user);

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const getCurrentUser = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

export default { register, login, getCurrentUser };
