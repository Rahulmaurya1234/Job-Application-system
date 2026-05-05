// routes/aiRoutes.js

import express from "express";
import axios from "axios";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/jobs", protect, async (req, res) => {
  try {
    // 🔥 DB se current resume nikala
    const user = await User.findById(req.user._id);

    if (!user?.resume) {
      return res.status(400).json({ msg: "No resume uploaded ❌" });
    }

    const resumeUrl = user.resume;

    console.log("Backend Resume URL:", resumeUrl);

    // 🔥 AI ko bheja
    const aiRes = await axios.post(
      "https://job-application-system-1.onrender.com/analyze",
      { resumeUrl }
    );

    res.json(aiRes.data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "AI fetch failed ❌" });
  }
});

export default router;