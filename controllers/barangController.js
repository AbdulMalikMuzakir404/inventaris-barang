const { Barang } = require('../models');

exports.getAll = async (_, res) => {
  try {
    const data = await Barang.findAll();
    res.json({
      success: true,
      message: 'Berhasil mengambil semua barang',
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data',
      error: error.message,
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Barang.findByPk(req.params.id);
    if (data) {
      res.json({
        success: true,
        message: 'Data barang ditemukan',
        data,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Barang tidak ditemukan',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data',
      error: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await Barang.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Barang berhasil ditambahkan',
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal menambahkan barang',
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
        message: 'Barang tidak ditemukan',
      });
    }

    await data.update(req.body);
    res.json({
      success: true,
      message: 'Barang berhasil diupdate',
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal mengupdate barang',
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
        message: 'Barang tidak ditemukan',
      });
    }

    await data.destroy();
    res.json({
      success: true,
      message: 'Barang berhasil dihapus',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal menghapus barang',
      error: error.message,
    });
  }
};
