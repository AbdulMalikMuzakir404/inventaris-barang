const Bull = require("bull");
const Redis = require("ioredis");

const redisOptions = {
  host: "127.0.0.1",
  port: 6379,
};

const exportQueue = new Bull("export-items", { redis: redisOptions });
const importQueue = new Bull("import-items", { redis: redisOptions });

module.exports = {
  exportQueue,
  importQueue,
};
