"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Barangs", "kategori");
    await queryInterface.removeColumn("Barangs", "lokasi");

    await queryInterface.addColumn("Barangs", "kategoriId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Kategoris",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true,
      after: 'nama'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Barangs", "kategori", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Barangs", "lokasi", {
      type: Sequelize.STRING,
    });

    await queryInterface.removeColumn("Barangs", "kategoriId");
  },
};
