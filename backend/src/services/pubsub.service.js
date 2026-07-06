import { redisPublisher, redisSubscriber } from "../config/redis.js";

const CHANNELS = {
  SOCKET_EVENT: "socket:event",
  CACHE_INVALIDATION: "cache:invalidation",
};

const publish = async (channel, payload) => {
  if (!redisPublisher) return false;

  try {
    await redisPublisher.publish(channel, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error(`Redis publish failed for ${channel}:`, err.message);
    return false;
  }
};

const subscribe = async (channel, handler) => {
  if (!redisSubscriber) return false;

  try {
    await redisSubscriber.subscribe(channel);
    redisSubscriber.on("message", (receivedChannel, message) => {
      if (receivedChannel !== channel) return;

      try {
        handler(JSON.parse(message));
      } catch (err) {
        console.error(`Redis subscriber handler failed for ${channel}:`, err.message);
      }
    });
    return true;
  } catch (err) {
    console.error(`Redis subscribe failed for ${channel}:`, err.message);
    return false;
  }
};

const publishSocketEvent = (payload) => publish(CHANNELS.SOCKET_EVENT, payload);

const publishCacheInvalidation = (payload) =>
  publish(CHANNELS.CACHE_INVALIDATION, payload);

export default {
  CHANNELS,
  publish,
  subscribe,
  publishSocketEvent,
  publishCacheInvalidation,
};
