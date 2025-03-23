const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, sequelize } = require("./config/database");

// Import models
const User = require("./models/User");
const Item = require("./models/Item");
const Goal = require("./models/Goal");

// Import routes
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const goalRoutes = require("./routes/goalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded images statically from root-level /uploads
const path = require("path");

const uploadsPath = path.resolve(__dirname, "uploads");
console.log("Serving uploads from:", uploadsPath);

// CORS headers for static image requests
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/uploads", express.static(uploadsPath));

// test rout for debugging
app.get("/test-image", (req, res) => {
  const testPath = path.join(
    __dirname,
    "uploads",
    "1742685407047-397001527.jpg"
  );
  console.log("Resolved test image path:", testPath);

  res.sendFile(testPath, (err) => {
    if (err) {
      console.error("sendFile error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

// Connedt to Database & Sync Models
connectDB();
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database & Tables Synced"));

//API Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/dashboard", dashboardRoutes);

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
