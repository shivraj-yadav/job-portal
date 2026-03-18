import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, authorizeRole('recruiter'), postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, authorizeRole('recruiter'), getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);

export default router;
