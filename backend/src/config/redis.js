import { Redis } from "@upstash/redis";

const hasRedisConfig =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

export const redis = hasRedisConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export const redisPublisher = redis;
export const redisSubscriber = null;

export const connectRedis = async () => {
  if (!redis) {
    console.log("Redis Disabled: Upstash credentials not configured");
    return false;
  }

  try {
    await redis.ping();
    console.log("Redis Connected");
    return true;
  } catch (error) {
    console.error("Redis Error:", error.message);
    return false;
  }
};

export const testRedis = async () => {
  if (!redis) return;

  try {
    await redis.set("test", "working", { ex: 60 });
    const value = await redis.get("test");

    console.log("Redis Test:", value);
  } catch (error) {
    console.error("Redis Error:", error.message);
  }
};
