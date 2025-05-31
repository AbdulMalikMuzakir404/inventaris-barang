const { Barang, Kategori } = require("../models");
const handleError = require("../utils/handleError");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const q = req.query.q?.trim();

    const isSearch = !!q;
    const isNumeric = !isNaN(q);

    const whereCondition = isSearch
      ? {
          [Op.or]: [
            { nama: { [Op.like]: `%${q}%` } },
            ...(isNumeric ? [{ stok: parseInt(q) }] : []),
          ],
        }
      : {};

    const kategoriInclude = {
      model: Kategori,
      as: "kategori",
      required: false,
      ...(isSearch && !isNumeric
        ? { where: { nama: { [Op.like]: `%${q}%` } } }
        : {}),
    };

    const result = await Barang.findAndCountAll({
      where: whereCondition,
      include: [kategoriInclude],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

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
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data",
      error: error.message,
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Barang.findByPk(req.params.id, {
      include: {
        model: Kategori,
        as: "kategori",
      },
    });
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

const deleteFile = require("../utils/deleteFile");

exports.create = async (req, res) => {
  try {
    const cover = req.file ? req.file.filename : null;

    const data = await Barang.create({
      ...req.body,
      cover,
    });

    res.status(201).json({
      success: true,
      message: "Barang berhasil ditambahkan",
      data,
    });
  } catch (error) {
    if (req.file) {
      deleteFile(req.file.filename);
    }

    res.status(500).json({
      success: false,
      message: "Gagal menambahkan barang",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await Barang.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Barang tidak ditemukan",
      });
    }

    const cover = req.file ? req.file.filename : data.cover;

    await data.update({
      ...req.body,
      cover,
    });

    res.json({
      success: true,
      message: "Barang berhasil diupdate",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Gagal mengupdate barang",
      error: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Barang.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    await data.destroy();
    res.json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Gagal menghapus kategori",
      error: error.message,
    });
  }
};
