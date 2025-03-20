const express = require("express");
const { body, validationResult } = require("express-validator");
const { verifyToken } = require("../middleware/authMiddleware");
const Item = require("../models/Item");

const router = express.Router();

// Create an Item - add to Wishlist
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Item name is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Valid price is required"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, price, imageUrl, link, category } = req.body;
      const item = await Item.create({
        userId: req.user.id,
        name,
        price,
        imageUrl,
        link,
        category,
        status: "waiting",
      });
      res.status(201).json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ errors: "Server error" });
    }
  }
);

// Update Item Status
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const item = await Item.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!item) return res.status(400).json({ error: "Invalid status" });

    //Allow only specific updates
    const { name, price, category, status } = req.body;
    if (status && !["waiting", "bought", "sold", "returned"].includes(status)) {
      return res.status(400).json({ error: "Invalid Status" });
    }

    await item.update({ name, price, category, status });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//Delete Item (Only if Sold or Returned)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const item = await Item.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (!["sold", "returned"].includes(item.status)) {
      return res
        .status(403)
        .json({ error: "Cannot delete item unless it's sold or returned" });
    }

    await item.destroy();
    res.json({ message: "Item deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
