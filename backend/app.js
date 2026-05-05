import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import atsRoutes from "./routes/atsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// Trust proxy for Render (important for rate limiting and IP detection)
app.set('trust proxy', 1);

// Increase timeout for long-running AI requests
app.use((req, res, next) => {
  // Set timeout to 30 seconds for all routes
  req.setTimeout(30000);
  res.setTimeout(30000);
  next();
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/uploads", express.static("uploads"));

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    msg: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

export default app;