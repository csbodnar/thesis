"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Itineraries", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      itineraryId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      pricingOptionId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      originIATA: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      originEntityId: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      destinationIATA: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      destinationEntityId: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      year: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      month: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      day: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      currency: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      market: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      locale: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      adults: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      cabinClass: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      childrenAges: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Itineraries");
  },
};
