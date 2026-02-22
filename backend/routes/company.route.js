import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// Register new company
router.post("/register", isAuthenticated, registerCompany);

// Get all companies of logged-in user
router.get("/", isAuthenticated, getCompany);

// Get company by ID
router.get("/:id", isAuthenticated, getCompanyById);

// Update company
router.put("/:id", isAuthenticated,singleUpload, updateCompany);

export default router;
