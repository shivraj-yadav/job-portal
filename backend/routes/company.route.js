import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
  deleteCompany
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// Register new company
router.post("/register", isAuthenticated, authorizeRole('recruiter'), registerCompany);

// Get all companies of logged-in user
router.get("/", isAuthenticated, authorizeRole('recruiter'), getCompany);

// Get company by ID
router.get("/:id", isAuthenticated, authorizeRole('recruiter'), getCompanyById);

// Update company
router.put("/:id", isAuthenticated, authorizeRole('recruiter'), singleUpload, updateCompany);

// Delete company
router.delete("/:id", isAuthenticated, authorizeRole('recruiter'), deleteCompany);

export default router;
