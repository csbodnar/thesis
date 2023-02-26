"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User.hasMany(models.Post);
    }

    checkPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }

    toJSON() {
      let data = this.get();

      if (data.hasOwnProperty("password")) {
        delete data.password;
      }

      return data;
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(user.password, salt);
          user.password = hash;
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
