import redisService from "./redis.service.js";

const ONLINE_USER_TTL_SECONDS = 24 * 60 * 60;

const key = (userId) => `online:user:${userId}`;

const setOnline = async (userId, socketId) => {
  await redisService.set(key(userId), socketId, ONLINE_USER_TTL_SECONDS);
};

const setOffline = async (userId, socketId) => {
  if (socketId) {
    const currentSocketId = await getSocketId(userId);
    if (currentSocketId && currentSocketId !== socketId) return;
  }

  await redisService.del(key(userId));
};

const getSocketId = async (userId) => redisService.get(key(userId));

const isOnline = async (userId) => {
  const exists = await redisService.exists(key(userId));
  return exists === 1;
};

const countOnlineUsers = async () => {
  return redisService.countKeys("online:user:*");
};

const refresh = async (userId) => {
  await redisService.expire(key(userId), ONLINE_USER_TTL_SECONDS);
};

export default {
  setOnline,
  setOffline,
  getSocketId,
  isOnline,
  countOnlineUsers,
  refresh,
};
