module.exports = {
  apps: [
    {
      name: "api",
      script: "index.js",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "worker",
      script: "worker.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
