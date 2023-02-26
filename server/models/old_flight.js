"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Flight.init(
    {
      icao24: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
      callsign: { type: DataTypes.STRING },
      origin_country: { type: DataTypes.STRING },
      time_position: { type: DataTypes.BIGINT },
      last_contact: { type: DataTypes.BIGINT },
      longitude: { type: DataTypes.FLOAT },
      latitude: { type: DataTypes.FLOAT },
      baro_altitude: { type: DataTypes.FLOAT },
      on_ground: { type: DataTypes.BOOLEAN },
      velocity: { type: DataTypes.FLOAT },
      true_track: { type: DataTypes.FLOAT },
      vertical_rate: { type: DataTypes.FLOAT },
      sensors: { type: DataTypes.JSON },
      geo_altitude: { type: DataTypes.FLOAT },
      squawk: { type: DataTypes.STRING },
      spi: { type: DataTypes.BOOLEAN },
      position_source: { type: DataTypes.TINYINT },
    },
    {
      sequelize,
      modelName: "Flight",
    }
  );
  return Flight;
};
