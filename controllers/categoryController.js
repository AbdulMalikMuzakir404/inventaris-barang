const { Kategori } = require("../models");

exports.getAll = async (_, res) => {
  try {
    const data = await Kategori.findAll();
    res.json({
      success: true,
      message: "Berhasil mengambil semua kategori",
      data,
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
    res.status(400).json({
      success: false,
      message: "Gagal menambahkan kategori",
      error: error.message,
    });
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
    const data = await Kategori.findByPk(req.params.id);
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
