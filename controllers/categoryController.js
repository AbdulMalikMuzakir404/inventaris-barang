const { Kategori, Barang } = require("../models");
const handleError = require("../utils/handleError");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const q = req.query.q?.trim();

    const isSearch = !!q;

    const whereCondition = isSearch
      ? {
          [Op.or]: [
            { nama: { [Op.like]: `%${q}%` } },
            { kode: { [Op.like]: `%${q}%` } },
          ],
        }
      : {};

    const result = await Kategori.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

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
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data",
      error: error.message,
    });
  }
};

exports.getAllSimple = async (req, res) => {
  try {
    const data = await Kategori.findAll({
      order: [["nama", "ASC"]],
      attributes: ["id", "kode", "nama"],
    });

    res.json({
      success: true,
      message: "Berhasil mengambil semua kategori (simple)",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data kategori",
      error: error.message,
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Kategori.findByPk(req.params.id);
    if (data) {
      res.json({
        success: true,
        message: "Data kategori ditemukan",
        data,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data",
      error: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await Kategori.create(req.body);
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
    const data = await Kategori.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    await data.update(req.body);
    res.json({
      success: true,
      message: "Kategori berhasil diupdate",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Gagal mengupdate kategori",
      error: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;

    const kategori = await Kategori.findByPk(id);
    if (!kategori) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    const relatedItems = await Barang.findOne({ where: { kategoriId: id } });
    if (relatedItems) {
      return res.status(400).json({
        success: false,
        message:
          "Kategori tidak dapat dihapus karena masih digunakan oleh item lain",
      });
    }

    await kategori.destroy();

    res.json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus kategori",
      error: error.message,
    });
  }
};
