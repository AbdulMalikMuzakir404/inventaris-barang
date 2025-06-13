const Bull = require("bull");
const Redis = require("ioredis");
require("dotenv").config();

const redisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: {}
};

const exportQueue = new Bull("export-items", { redis: redisOptions });
const importQueue = new Bull("import-items", { redis: redisOptions });

module.exports = {
  exportQueue,
  importQueue,
};