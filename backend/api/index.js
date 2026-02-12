import dotenv from "dotenv";
dotenv.config();

import app from "../src/app.js";
import connectDB from "../src/config/db.js";

let isConnected = false;

export default async function handler(req, res) {
  // Connect to database on cold start
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error("Database connection error:", error);
      return res.status(500).json({
        status: "error",
        message: "Database connection failed",
      });
    }
  }

  // Let Express handle the request
  return app(req, res);
}
