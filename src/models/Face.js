const { DataTypes, Model } = require("sequelize");

const db = require("../db");

class Face extends Model {}

Face.init(
  {
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    embedding: {
      type: DataTypes.VECTOR,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "faces",
  }
);

module.exports = Face;
