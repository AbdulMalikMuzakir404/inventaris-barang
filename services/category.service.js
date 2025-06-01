const { Kategori, Barang } = require("../models");
const { Op } = require("sequelize");

exports.findAll = async (q, limit, offset) => {
  const isSearch = !!q;
  const whereCondition = isSearch
    ? {
        [Op.or]: [
          { nama: { [Op.like]: `%${q}%` } },
          { kode: { [Op.like]: `%${q}%` } },
        ],
      }
    : {};

  return await Kategori.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
};

exports.findAllSimple = async () => {
  return await Kategori.findAll({
    order: [["nama", "ASC"]],
    attributes: ["id", "kode", "nama"],
  });
};

exports.findById = async (id) => {
  return await Kategori.findByPk(id);
};

exports.create = async (payload) => {
  return await Kategori.create(payload);
};

exports.update = async (kategori, payload) => {
  return await kategori.update(payload);
};

exports.remove = async (kategori) => {
  return await kategori.destroy();
};

exports.hasRelatedItems = async (kategoriId) => {
  return await Barang.findOne({ where: { kategoriId } });
};
