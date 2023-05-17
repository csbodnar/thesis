"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Itinerary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Itinerary.hasMany(models.User);
    }

    toJSON() {
      let data = this.get();

      return data;
    }
  }
  Itinerary.init(
    {
      itineraryId: DataTypes.STRING,
      priceAmount: DataTypes.INTEGER,
      priceUnit: DataTypes.STRING,
      lastCheckPriceAmount: DataTypes.INTEGER,
      lastCheckPriceUnit: DataTypes.STRING,
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
      modelName: "Itinerary",
    }
  );
  return Itinerary;
};
