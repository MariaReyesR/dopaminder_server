const express = require("express");

const router = express.Router();

// temporary placeholder route
router.get("/", (req, res) => {
  res.json({ message: "Goal routes are working!" });
});

module.exports = router;
