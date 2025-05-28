'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Kategoris", "kode", {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'nama'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Kategoris", "kode");
  }
};
