"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Flights", {
      icao24: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      callsign: {
        type: Sequelize.STRING,
      },
      origin_country: {
        type: Sequelize.STRING,
      },
      time_position: {
        type: Sequelize.DATE,
      },
      last_contact: {
        type: Sequelize.DATE,
      },
      longitude: {
        type: Sequelize.FLOAT,
      },
      latitude: {
        type: Sequelize.FLOAT,
      },
      baro_altitude: {
        type: Sequelize.FLOAT,
      },
      on_ground: {
        type: Sequelize.BOOLEAN,
      },
      velocity: {
        type: Sequelize.FLOAT,
      },
      true_track: {
        type: Sequelize.FLOAT,
      },
      vertical_rate: {
        type: Sequelize.FLOAT,
      },
      sensors: {
        type: Sequelize.JSON,
      },
      geo_altitude: {
        type: Sequelize.FLOAT,
      },
      squawk: {
        type: Sequelize.STRING,
      },
      spi: {
        type: Sequelize.BOOLEAN,
      },
      position_source: {
        type: Sequelize.TINYINT,
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
    await queryInterface.dropTable("Flights");
  },
};
