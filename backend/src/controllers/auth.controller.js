import * as authService from "../services/auth.service.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const register = catchAsync(async (req, res, next) => {
  try {
    console.log("Registration attempt:", {
      email: req.body.email,
      name: req.body.name,
    });

    const { user, token } = await authService.signup(req.body);

    console.log("Registration successful:", user.email);

    res.status(201).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    throw error;
  }
});

export const login = catchAsync(async (req, res, next) => {
  try {
    console.log("Login attempt:", { email: req.body.email });

    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    console.log("Login successful:", user.email);

    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
});

export const googleCallback = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication failed", 401));
  }

  const { user, token } = await authService.googleAuth(req.user._id);

  // Redirect to frontend login page with token
  const frontendURL =
    process.env.FRONTEND_URL?.split(",").map((origin) => origin.trim()).filter(Boolean)[0] ||
    "http://localhost:5173";
  res.redirect(
    `${frontendURL}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`,
  );
});

export const googleAuthFailure = (req, res) => {
  const frontendURL =
    process.env.FRONTEND_URL?.split(",").map((origin) => origin.trim()).filter(Boolean)[0] ||
    "http://localhost:5173";
  res.redirect(`${frontendURL}/login?error=google_auth_failed`);
};
