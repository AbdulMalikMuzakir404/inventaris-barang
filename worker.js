const { exportQueue, importQueue } = require("./queues/queue");
const registerJobs = require("./jobs/item.job");
const fs = require("fs");
const path = require("path");

const exportDir = path.join(__dirname, "public/exports");
if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

registerJobs(exportQueue, importQueue);
console.log("✅ Worker aktif dan siap memproses antrean...");
