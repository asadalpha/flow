import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./config/passport.js";

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import AppError from "./utils/AppError.js";

const app = express();

// Middleware
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// CORS Configuration
const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://flow-app-weld-seven.vercel.app",
];

const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];

const allowedOrigins = [...new Set([...envOrigins, ...defaultOrigins])];

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Log rejected origins for debugging
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600, // 10 minutes
  }),
);

// Session configuration for passport
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health Check Routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Job Tracker API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: "connected",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "API is operational",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);

// Unhandled Routes (must be after all other routes)
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
