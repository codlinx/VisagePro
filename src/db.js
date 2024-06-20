const { Sequelize } = require("sequelize");

const pgvector = require("pgvector/sequelize");

pgvector.registerType(Sequelize);

module.exports = new Sequelize(
  "postgres://testuser:testpwd@localhost:5432/vectordb",
  {
    dialect: "pg",
    dialectOptions: {
      charset: "utf8mb4",
    },
    pool: {
      max: 100,
      min: 1,
      acquire: 60000,
      idle: 10000,
    },
    logging: console.log,
  }
);