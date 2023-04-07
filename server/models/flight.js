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
      Flight.belongsTo(models.User);
    }

    toJSON() {
      let data = this.get();

      return data;
    }
  }
  Flight.init(
    {
      UserId: DataTypes.INTEGER,
      itineraryId: DataTypes.STRING,
      pricingOptionId: DataTypes.STRING,
      originIATA: DataTypes.STRING,
      originEntityId: DataTypes.STRING,
      destinationIATA: DataTypes.STRING,
      destinationEntityId: DataTypes.STRING,
      year: DataTypes.INTEGER,
      month: DataTypes.INTEGER,
      day: DataTypes.INTEGER,
      currency: DataTypes.STRING,
      market: DataTypes.STRING,
      locale: DataTypes.STRING,
      adults: DataTypes.INTEGER,
      cabinClass: DataTypes.STRING,
      childrenAges: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Flight",
    }
  );
  return Flight;
};
