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
});

User.hasOne(Goal, { foreignKey: "UserId", onDelete: "CASCADE" });
Goal.belongsTo(User, { foreignKey: "userId" });

module.exports = Goal;
