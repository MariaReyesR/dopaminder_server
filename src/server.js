const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, sequelize } = require("../config/database");

// Import models
const User = require("../models/User");
const Item = require("../models/Item");
const Goal = require("../models/Goal");

// Import routes
const authRoutes = require("../routes/authRoutes");
const itemRoutes = require("../routes/itemRoutes");
const goalRoutes = require("../routes/goalRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// Connedt to Database & Sync Models
connectDB();
sequelize.sync().then(() => console.log("Database & Tables Synced"));

//API Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/goals", goalRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
