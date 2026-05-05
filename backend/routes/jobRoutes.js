import express from "express";
import { createJob, getJobs } from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// recruiter job post
router.post("/create", protect, createJob);

// sab jobs
router.get("/", getJobs);

export default router;