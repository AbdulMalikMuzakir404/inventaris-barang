const fs = require("fs");
const path = require("path");

function deleteFile(fileName) {
  if (!fileName) return;

  const filePath = path.join(__dirname, "../public/uploads", fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error("❌ Gagal menghapus file:", unlinkErr);
      });
    }
  });
}

module.exports = deleteFile;
