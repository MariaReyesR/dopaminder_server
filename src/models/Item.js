const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");

const Item = sequelize.define("Item", {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cloudinaryId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  link: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM(
      "Clothing & Accessories",
      "Tech & Gadgets",
      "Home & Decor",
      "Beauty & Makeup",
      "Books & Stationery",
      "Toys & Collectibles",
      "Health & Fitness",
      "Entertainment",
      "Other"
    ),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("waiting", "bought", "sold", "returned"),
    defaultValue: "waiting",
  },
});

User.hasMany(Item, { foreignKey: "userId", onDelete: "CASCADE" });
Item.belongsTo(User, { foreignKey: "userId" });

module.exports = Item;
