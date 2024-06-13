const { DataTypes, Model } = require("sequelize");

const Face = require("./Face");

const db = require("../db");

class Customer extends Model {}

Customer.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["Ativo", "Inativo"],
      allowNull: false,
      defaultValue: "Inativo",
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: db,
    modelName: "customers",
  }
);

Customer.hasMany(Face);

module.exports = Customer;
