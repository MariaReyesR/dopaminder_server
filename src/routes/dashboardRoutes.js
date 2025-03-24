const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const Item = require("../models/Item");
const { sequelize } = require("../config/database");

const router = express.Router();

//Get
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalSpend =
      (await Item.sum("price", {
        where: { userId, status: "bought" },
      })) || 0;

    const totalWishlist = (await Item.sum("price", { where: { userId } })) || 0;

    const savings = totalWishlist - totalSpend;

    // Monthly Breakdown
    const monthlyBreakdown = await Item.findAll({
      where: { userId, status: "bought" },
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("updatedAt"), "%Y-%m"),
          "month",
        ],
        [sequelize.fn("SUM", sequelize.col("price")), "totalSpent"],
      ],
      group: ["month"],
      raw: true,
    });

    // Spending by category
    const categoryBreakdown = await Item.findAll({
      where: { userId, status: "bought" },
      attributes: [
        "category",
        [sequelize.fn("SUM", sequelize.col("price")), "totalSpent"],
      ],
      group: ["category"],
      raw: true,
    });

    res.json({
      totalSpend,
      totalWishlist,
      savings,
      monthlyBreakdown,
      categoryBreakdown,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
