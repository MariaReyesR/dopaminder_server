const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");

const Goal = sequelize.define("Goal", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: "id" },
  },
  goalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  goalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  savedAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  goalImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.hasOne(Goal, { foreignKey: "userId", onDelete: "CASCADE" });
Goal.belongsTo(User, { foreignKey: "userId" });

module.exports = Goal;
