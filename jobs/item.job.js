const itemService = require("../services/item.service");
const handleError = require("../utils/handleError");
const fs = require("fs");
const path = require("path");

module.exports = (exportQueue, importQueue) => {
  exportQueue.process("export", async (job) => {
    console.log("📤 [EXPORT] Memproses job export ID:", job.id);
    try {
      const buffer = await itemService.exportItems(job.data.filters || {});
      const filename = `export-barang-${Date.now()}.xlsx`;
      const exportPath = path.join(__dirname, "../public/exports", filename);
      fs.writeFileSync(exportPath, buffer);
      console.log("✅ [EXPORT] Berhasil ekspor ke:", filename);
      return { downloadUrl: `/exports/${filename}`, filename };
    } catch (err) {
      handleError(null, err, "❌ [EXPORT] Gagal memproses export");
      throw err;
    }
  });

  importQueue.process("import", async (job) => {
    console.log("📥 [IMPORT] Memproses job import ID:", job.id);
    try {
      const filePath = path.join(
        __dirname,
        "../public/uploads",
        job.data.filename
      );
      const count = await itemService.importItems(filePath);
      console.log(`✅ [IMPORT] Impor selesai, total barang: ${count}`);
      return { imported: count };
    } catch (err) {
      handleError(null, err, "❌ [IMPORT] Gagal memproses import");
      throw err;
    }
  });
};
