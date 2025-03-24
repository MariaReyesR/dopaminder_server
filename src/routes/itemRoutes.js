const express = require("express");
const { body, validationResult } = require("express-validator");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const Item = require("../models/Item");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

// Create an Item - add to Wishlist
router.post(
  "/",
  verifyToken,
  upload.single("image"),
  [
    body("name").notEmpty().withMessage("Item name is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Valid price is required"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, price, link, category } = req.body;

      const imageUrl = req.file?.path || req.body.imageUrl?.trim() || null;
      const cloudinaryId = req.file?.filename || null;

      const item = await Item.create({
        userId: req.user.id,
        name,
        price,
        imageUrl,
        cloudinaryId,
        link,
        category,
        status: "waiting",
      });

      res.status(201).json(item);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ errors: "Internal Server Error" });
    }
  }
);
// Get items
router.get("/", verifyToken, async (req, res) => {
  try {
    const items = await Item.findAll({ where: { userId: req.user.id } });
    res.json(items);
  } catch (error) {
    console.error("Error fetching items", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single Item
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const item = await Item.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

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
    console.error("Error updating item", error);
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

    //delete image from cloudinary
    if (item.cloudinaryId) {
      await cloudinary.uploader.destroy(item.cloudinaryId);
    }

    await item.destroy();
    res.json({ message: "Item deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
