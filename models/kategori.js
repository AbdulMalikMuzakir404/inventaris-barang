"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kategori extends Model {
    static associate(models) {
      Kategori.hasMany(models.Barang, {
        foreignKey: "kategoriId",
        as: "barangs",
      });
    }
  }
  Kategori.init(
    {
      nama: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Kategori",
      tableName: 'Kategoris',
    }
  );
  return Kategori;
};
