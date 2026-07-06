import http from "http";
import app from "./app.js";

import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { initializeSocket } from "./socket/index.js";
import { testRedis } from "./config/redis.js";

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    await testRedis();
    const server = http.createServer(app);

    // Initialize Socket.IO
    initializeSocket(server);

    server.listen(env.PORT, () => {
      console.log(`Server running on ${env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();