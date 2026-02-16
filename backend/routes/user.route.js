import express from "express";
import {
  login,
  logout,
  register,
  updateProfile
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
const router = express.Router();

// Register user
router.post("/register", singleUpload,register);

// Login user
router.post("/login", login);

// Logout user
router.post("/logout", isAuthenticated, logout);

// Update user profile
router.patch("/profile", isAuthenticated, updateProfile);

export default router;
