import { redis } from "../config/redis.js";

const logRedisError = (action, error) => {
  console.error(`Redis Error [${action}]:`, error.message);
};

const withRedis = async (action, operation, fallback = null) => {
  if (!redis) return fallback;

  try {
    return await operation(redis);
  } catch (err) {
    logRedisError(action, err);
    return fallback;
  }
};

const get = async (key) => withRedis("get", (client) => client.get(key));

const set = async (key, value, ttlSeconds) =>
  withRedis("set", (client) => {
    if (ttlSeconds) {
      return client.set(key, value, { ex: ttlSeconds });
    }

    return client.set(key, value);
  });

const del = async (...keys) => {
  const normalizedKeys = keys.flat().filter(Boolean);
  if (normalizedKeys.length === 0) return 0;

  return withRedis("delete", (client) => client.del(...normalizedKeys), 0);
};

const exists = async (key) => withRedis("exists", (client) => client.exists(key), 0);

const expire = async (key, ttlSeconds) =>
  withRedis("expire", (client) => client.expire(key, ttlSeconds), 0);

const getCache = async (key) => {
  const value = await get(key);
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch (err) {
    logRedisError(`parse:${key}`, err);
    await del(key);
    return null;
  }
};

const setCache = async (key, value, ttlSeconds) =>
  set(key, JSON.stringify(value), ttlSeconds);

const deleteCache = async (key) => del(key);

const clearPattern = async (pattern) =>
  withRedis("clearPattern", async (client) => {
    let cursor = "0";
    let deletedCount = 0;

    do {
      const [nextCursor, keys] = await client.scan(cursor, {
        match: pattern,
        count: 100,
      });

      cursor = nextCursor.toString();

      if (keys.length > 0) {
        deletedCount += await client.del(...keys);
      }
    } while (cursor !== "0");

    return deletedCount;
  }, 0);

const scanKeys = async (pattern) =>
  withRedis("scanKeys", async (client) => {
    let cursor = "0";
    const keys = [];

    do {
      const [nextCursor, foundKeys] = await client.scan(cursor, {
        match: pattern,
        count: 100,
      });

      cursor = nextCursor.toString();
      keys.push(...foundKeys);
    } while (cursor !== "0");

    return keys;
  }, []);

const countKeys = async (pattern) =>
  withRedis("countKeys", async (client) => {
    let cursor = "0";
    let total = 0;

    do {
      const [nextCursor, keys] = await client.scan(cursor, {
        match: pattern,
        count: 100,
      });

      cursor = nextCursor.toString();
      total += keys.length;
    } while (cursor !== "0");

    return total;
  }, 0);

const getJson = getCache;
const setJson = setCache;
const delByPattern = clearPattern;

export default {
  get,
  set,
  del,
  exists,
  expire,
  getCache,
  setCache,
  deleteCache,
  clearPattern,
  scanKeys,
  countKeys,
  getJson,
  setJson,
  delByPattern,
};
