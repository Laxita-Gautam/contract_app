import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import contractRouter from "./routes/contract.route.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// ========================================
// CORS
// ========================================

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ========================================
// JSON
// ========================================

app.use(express.json());

// ========================================
// DATABASE
// ========================================

connectDB();

// ========================================
// API ROUTES
// ========================================

app.use("/api/contract", contractRouter);

// ========================================
// HEALTH CHECK
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Contract API is running",
  });
});

// ========================================
// SERVER
// ========================================

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
