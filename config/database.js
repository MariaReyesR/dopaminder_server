const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  { host: process.env.DB_HOST, dialect: "mysql", logging: false }
);

const connectDB = async () => {
  try {
    await Sequelize.authenticate();
    console.log("MySQL Connected");
  } catch (error) {
    console.log("Database connection failed:", error);
    process.getMaxListeners(1);
  }
};

export default { sequelize, connectDB };
