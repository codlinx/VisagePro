const { Sequelize } = require("sequelize");

const pgvector = require("pgvector/sequelize");

pgvector.registerType(Sequelize);

module.exports = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
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
