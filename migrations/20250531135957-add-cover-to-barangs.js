"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Barangs", "cover", {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'stok'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Barangs", "cover");
  },
};
