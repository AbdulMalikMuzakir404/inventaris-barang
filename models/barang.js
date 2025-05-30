"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Barang extends Model {
    static associate(models) {
      Barang.belongsTo(models.Kategori, {
        foreignKey: "kategoriId",
        as: "kategori",
      });
    }
  }
  Barang.init(
    {
      nama: DataTypes.STRING,
      kategoriId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Kategoris",
          key: "id",
        },
        allowNull: true,
      },
      stok: DataTypes.INTEGER,
      cover: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Barang",
      tableName: "Barangs",
    }
  );
  return Barang;
};
