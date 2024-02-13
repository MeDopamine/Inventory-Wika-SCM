'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kodeProjek: {
        type: Sequelize.STRING
      },
      namaProjek: {
        type: Sequelize.STRING
      },
      statusProjek: {
        type: Sequelize.STRING
      },
      statusProjek: {
        type: Sequelize.STRING
      },
      koedDivisi: {
        type: Sequelize.STRING
      },
      namaDivisi: {
        type: Sequelize.STRING
      },
      kodeDepartemen: {
        type: Sequelize.STRING
      },
      namaDepartemen: {
        type: Sequelize.STRING
      },
      kodeMaterialGrup: {
        type: Sequelize.STRING
      },
      namaMaterialGrup: {
        type: Sequelize.STRING
      },
      kodeMaterial: {
        type: Sequelize.STRING
      },
      namaMaterial: {
        type: Sequelize.STRING
      },
      uom: {
        type: Sequelize.STRING
      },
      nomorPo: {
        type: Sequelize.STRING
      },
      tanggalPo: {
        type: Sequelize.STRING
      },
      poQuantity: {
        type: Sequelize.STRING
      },
      poPrice: {
        type: Sequelize.STRING
      },
      poTotalValue: {
        type: Sequelize.STRING
      },
      kodeVendor: {
        type: Sequelize.STRING
      },
      namaVendor: {
        type: Sequelize.STRING
      },
      kodeGr: {
        type: Sequelize.STRING
      },
      tanggalGr: {
        type: Sequelize.STRING
      },
      grQuantity: {
        type: Sequelize.STRING
      },
      grValue: {
        type: Sequelize.STRING
      },
      outstandingGr: {
        type: Sequelize.STRING
      },
      kodeGi: {
        type: Sequelize.STRING
      },
      tanggalGi: {
        type: Sequelize.STRING
      },
      giQuantity: {
        type: Sequelize.STRING
      },
      giValue: {
        type: Sequelize.STRING
      },
      inventory: {
        type: Sequelize.STRING
      },
      inventorValue: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inventories');
  }
};