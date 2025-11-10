const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

const app = express();

// ============================================
// CORS CONFIGURATION
// ============================================
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Development lokal
      "https://vandal.vercel.app", // Production frontend (ganti sesuai URL Anda)
      /^https:\/\/.*\.vercel\.app$/, // Semua preview Vercel
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// DATABASE CONNECTION (CACHED FOR SERVERLESS)
// ============================================
let isConnected = false;

const connectDB = async () => {
  // Kalau sudah connected, skip
  if (isConnected) {
    console.log("📦 Using cached database connection");
    return;
  }

  try {
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    isConnected = mongoose.connection.readyState === 1;

    console.log("✅ MongoDB Connected Successfully!");
    console.log(`📍 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    isConnected = false;
    throw error;
  }
};

// ============================================
// MIDDLEWARE: CONNECT DB BEFORE EVERY REQUEST
// ============================================
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      error: "Database connection failed",
      message: error.message,
    });
  }
});

// ============================================
// IMPORT ROUTES
// ============================================
const registerRoutes = require("../routes/registerRoutes");
const watchlistRoutes = require("../routes/watchlistRoutes");
const portofolioRoutes = require("../routes/portofolioRoutes");

// Import middleware
const verifyToken = require("../middleware/verifyToken");

// ============================================
// USE ROUTES
// ============================================
app.use("/api/register", verifyToken, registerRoutes);
app.use("/api/watchlist", verifyToken, watchlistRoutes);
app.use("/api/portofolio", verifyToken, portofolioRoutes);

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Vandal Backend is running on Vercel Serverless",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// ============================================
// ROOT ENDPOINT
// ============================================
app.get("/", (req, res) => {
  res.send(`
    <h1>Vandal Backend API</h1>
    <p>Powered by Vercel Serverless</p>
    <p>Status: <strong>Running</strong></p>
    <a href="/api/health">Health Check</a>
  `);
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.path,
    availableEndpoints: ["/api/health", "/api/register", "/api/watchlist", "/api/portofolio"],
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message,
  });
});

// ============================================
// EXPORT FOR VERCEL (NO app.listen()!)
// ============================================
module.exports = app;
