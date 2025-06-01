const categoryService = require("../services/category.service");
const handleError = require("../utils/handleError");

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const q = req.query.q?.trim();

    const result = await categoryService.findAll(q, limit, offset);

    res.json({
      success: true,
      message: "Berhasil mengambil semua kategori",
      data: result.rows,
      total: result.count,
      page,
      limit,
      totalPages: Math.ceil(result.count / limit),
    });
  } catch (error) {
    handleError(res, error, "Gagal mengambil data kategori");
  }
};

exports.getAllSimple = async (req, res) => {
  try {
    const data = await categoryService.findAllSimple();
    res.json({
      success: true,
      message: "Berhasil mengambil semua kategori (simple)",
      data,
    });
  } catch (error) {
    handleError(res, error, "Gagal mengambil data kategori");
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await categoryService.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Data kategori ditemukan",
      data,
    });
  } catch (error) {
    handleError(res, error, "Gagal mengambil data kategori");
  }
};

exports.create = async (req, res) => {
  try {
    const data = await categoryService.create(req.body);
    res.status(201).json({
      success: true,
      message: "Kategori berhasil ditambahkan",
      data,
    });
  } catch (error) {
    handleError(res, error, "Gagal menambahkan kategori");
  }
};

exports.update = async (req, res) => {
  try {
    const kategori = await categoryService.findById(req.params.id);
    if (!kategori) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    await categoryService.update(kategori, req.body);

    res.json({
      success: true,
      message: "Kategori berhasil diupdate",
      data: kategori,
    });
  } catch (error) {
    handleError(res, error, "Gagal mengupdate kategori");
  }
};

exports.remove = async (req, res) => {
  try {
    const kategori = await categoryService.findById(req.params.id);
    if (!kategori) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    const related = await categoryService.hasRelatedItems(kategori.id);
    if (related) {
      return res.status(400).json({
        success: false,
        message:
          "Kategori tidak dapat dihapus karena masih digunakan oleh item lain",
      });
    }

    await categoryService.remove(kategori);

    res.json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    handleError(res, error, "Terjadi kesalahan saat menghapus kategori");
  }
};
