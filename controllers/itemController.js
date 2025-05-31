const { Barang, Kategori } = require("../models");
const { Op } = require("sequelize");
const deleteFile = require("../utils/deleteFile");
const handleError = require("../utils/handleError");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

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
    handleError(res, error, "Gagal mengambil data barang");
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
        message: "Data barang ditemukan",
        data,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Barang tidak ditemukan",
      });
    }
  } catch (error) {
    handleError(res, error, "Gagal mengambil detail barang");
  }
};

exports.create = async (req, res) => {
  try {
    const fileName = req.file ? req.file.filename : null;
    const cover = fileName ? `${BASE_URL}/uploads/${fileName}` : null;

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
    if (req.file) deleteFile(req.file.filename);

    handleError(res, error, "Gagal menambahkan barang");
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

    let cover = data.cover;

    if (req.file) {
      const newFile = req.file.filename;
      const oldFile = data.cover?.split("/uploads/")[1];

      if (oldFile) deleteFile(oldFile);

      cover = `${BASE_URL}/uploads/${newFile}`;
    }

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
    if (req.file) deleteFile(req.file.filename);

    handleError(res, error, "Gagal mengupdate barang");
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Barang.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Barang tidak ditemukan",
      });
    }

    const fileName = data.cover?.split("/uploads/")[1];
    if (fileName) deleteFile(fileName);

    await data.destroy();
    res.json({
      success: true,
      message: "Barang berhasil dihapus",
    });
  } catch (error) {
    handleError(res, error, "Gagal menghapus barang");
  }
};
