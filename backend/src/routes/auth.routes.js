import express from "express";
import passport from "passport";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", authController.register);
router.post("/login", authController.login);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  authController.googleCallback,
);

router.get("/google/failure", authController.googleAuthFailure);

export default router;
