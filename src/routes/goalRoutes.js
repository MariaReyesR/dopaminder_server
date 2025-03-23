const express = require("express");
const { body, validationResult } = require("express-validator");
const { verifyToken } = require("../middleware/authMiddleware");
const Goal = require("../models/Goal");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

//Create a Goal
router.post(
  "/",
  verifyToken,
  [
    body("goalName").notEmpty().withMessage("Goal name is required"),
    body("goalAmount")
      .isFloat({ gt: 0 })
      .withMessage("Goal amount must be greater than zero"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { goalName, goalAmount } = req.body;
      const goalImage = req.file?.path || req.body.goalImage?.trim() || null;

      const goal = await Goal.create({
        userId: req.user.id,
        goalName,
        goalAmount,
        goalImage,
        savedAmount: 0,
      });
      res.status(201).json(goal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// GET User Goal
router.get("/", verifyToken, async (req, res) => {
  try {
    const goal = await Goal.findOne({ where: { userId: req.user.id } });
    if (!goal) return res.status(404).json({ error: "No goal found" });
    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update Goal (example: Pay off debt)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    const { goalName, goalAmount, savedAmount } = req.body;
    const goalImage =
      req.file?.path || req.body.goalImage?.trim() || goal.goalImage;

    if (goalAmount && goalAmount <= 0) {
      return res
        .status(400)
        .json({ error: "Goal amount must be greater than zero" });
    }
    if (savedAmount && savedAmount < 0) {
      return res.status(400).json({ error: "Saved amount cannot be negative" });
    }
    if (goalAmount && savedAmount && savedAmount > goalAmount) {
      return res
        .status(400)
        .json({ error: "Saved amount cannot exceed goal amount" });
    }
    await goal.update({ goalName, goalAmount, savedAmount, goalImage });
    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete Goal
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    await goal.destroy();
    res.json({ message: "Goal deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
