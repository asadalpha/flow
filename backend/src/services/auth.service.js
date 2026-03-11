import User from "../models/User.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
};

export const signup = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      throw new AppError("Please provide name, email, and password", 400);
    }

    if (userData.password.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    const newUser = await User.create(userData);
    const token = signToken(newUser._id);

    // Remove password from response
    newUser.password = undefined;

    return { user: newUser, token };
  } catch (error) {
    console.error("Signup service error:", error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    // 1) Check if email and password exist
    if (!email || !password) {
      throw new AppError("Please provide email and password!", 400);
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError("Incorrect email or password", 401);
    }

    // Check if user signed up with Google
    if (user.googleId && !user.password) {
      throw new AppError("Please sign in with Google", 401);
    }

    if (!(await user.correctPassword(password, user.password))) {
      throw new AppError("Incorrect email or password", 401);
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id);

    // Remove password from response
    user.password = undefined;

    return { user, token };
  } catch (error) {
    console.error("Login service error:", error);
    throw error;
  }
};

export const googleAuth = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const token = signToken(user._id);
  return { user, token };
};
