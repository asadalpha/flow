const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Log all errors for debugging
  console.error("Error Handler:", {
    message: err.message,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    err.message = errors.join(". ");
    err.statusCode = 400;
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    err.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    err.statusCode = 400;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    err.message = "Invalid token. Please log in again.";
    err.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    err.message = "Token expired. Please log in again.";
    err.statusCode = 401;
  }

  // Send error response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && {
      error: err,
      stack: err.stack,
    }),
  });
};

export default errorHandler;
