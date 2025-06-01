const { Barang, Kategori } = require("../models");
const { Op } = require("sequelize");

exports.findAll = async (q, limit, offset) => {
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

  return await Barang.findAndCountAll({
    where: whereCondition,
    include: [kategoriInclude],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
};

exports.findById = async (id) => {
  return await Barang.findByPk(id, {
    include: { model: Kategori, as: "kategori" },
  });
};

exports.create = async (payload) => {
  return await Barang.create(payload);
};

exports.update = async (item, payload) => {
  return await item.update(payload);
};

exports.remove = async (item) => {
  return await item.destroy();
};
