const express = require("express");

const router = express.Router();

// temporary placeholder route
router.get("/", (req, res) => {
  res.json({ message: "Item routes are working!" });
});

module.exports = router;
