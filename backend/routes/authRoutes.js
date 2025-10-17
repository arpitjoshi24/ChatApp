import express from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Utility: generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ---------------- Local Auth ----------------
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

// ---------------- Google OAuth ----------------
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/chat?token=${token}`);
  }
);

// ---------------- Facebook OAuth ----------------
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/chat?token=${token}`);
  }
);

// ---------------- LinkedIn OAuth ----------------
router.get("/linkedin", passport.authenticate("linkedin", { state: true }));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/chat?token=${token}`);
  }
);

export default router;
