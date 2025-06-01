const itemService = require("../services/item.service");
const deleteFile = require("../utils/deleteFile");
const handleError = require("../utils/handleError");
const { exportQueue, importQueue } = require("../queues/queue");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const q = req.query.q?.trim();

    const result = await itemService.findAll(q, limit, offset);

    res.json({
      success: true,
      message: "Berhasil mengambil data barang",
      data: result.rows,
      total: result.count,
      page,
      limit,
      totalPages: Math.ceil(result.count / limit),
    });
  } catch (error) {
    handleError(res, error, "Gagal mengambil data barang");
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await itemService.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Barang tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Data barang ditemukan",
      data,
    });
  } catch (error) {
    handleError(res, error, "Gagal mengambil detail barang");
  }
};

exports.create = async (req, res) => {
  try {
    const fileName = req.file ? req.file.filename : null;
    const cover = fileName ? `${BASE_URL}/uploads/${fileName}` : null;

    const data = await itemService.create({
      ...req.body,
      cover,
    });

    res.status(201).json({
      success: true,
      message: "Barang berhasil ditambahkan",
      data,
    });
  } catch (error) {
    if (req.file) deleteFile(req.file.filename);
    handleError(res, error, "Gagal menambahkan barang");
  }
};

exports.update = async (req, res) => {
  try {
    const item = await itemService.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Barang tidak ditemukan",
      });
    }

    let cover = item.cover;

    if (req.file) {
      const newFile = req.file.filename;
      const oldFile = item.cover?.split("/uploads/")[1];
      if (oldFile) deleteFile(oldFile);
      cover = `${BASE_URL}/uploads/${newFile}`;
    }

    await itemService.update(item, {
      ...req.body,
      cover,
    });

    res.json({
      success: true,
      message: "Barang berhasil diupdate",
      data: item,
    });
  } catch (error) {
    if (req.file) deleteFile(req.file.filename);
    handleError(res, error, "Gagal mengupdate barang");
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await itemService.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Barang tidak ditemukan",
      });
    }

    const fileName = item.cover?.split("/uploads/")[1];
    if (fileName) deleteFile(fileName);

    await itemService.remove(item);

    res.json({
      success: true,
      message: "Barang berhasil dihapus",
    });
  } catch (error) {
    handleError(res, error, "Gagal menghapus barang");
  }
};

exports.queueExport = async (req, res) => {
  try {
    const job = await exportQueue.add("export", { filters: req.query });
    res
      .status(200)
      .json({ success: true, message: "Job ekspor dimasukkan", jobId: job.id });
  } catch (err) {
    handleError(res, err, "Gagal membuat job ekspor");
  }
};

exports.queueImport = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "File Excel wajib diunggah" });
    const job = await importQueue.add("import", {
      filename: req.file.filename,
    });
    res
      .status(200)
      .json({ success: true, message: "Job impor dimasukkan", jobId: job.id });
  } catch (err) {
    handleError(res, err, "Gagal membuat job impor");
  }
};

exports.checkExportStatus = async (req, res) => {
  try {
    const job = await exportQueue.getJob(req.params.jobId);
    if (!job)
      return res
        .status(404)
        .json({ success: false, message: "Job tidak ditemukan" });
    const [state, result] = await Promise.all([
      job.getState(),
      job.finished().catch(() => null),
    ]);
    res.json({ success: true, state, result });
  } catch (err) {
    handleError(res, err, "Gagal ambil status job");
  }
};
