import express from "express";
import axios from "axios";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/jobs", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user?.resume) {
      return res.status(400).json({ msg: "No resume uploaded ❌" });
    }

    let resumeUrl = user.resume;

    // ✅ Safety (agar kabhi old URL aa jaye)
    if (resumeUrl.includes("/upload/") && !resumeUrl.includes("/raw/upload/")) {
      resumeUrl = resumeUrl.replace("/upload/", "/raw/upload/");
    }

    console.log("Using Resume URL:", resumeUrl);

    const aiRes = await axios.post(
      "https://job-application-system-1.onrender.com/analyze",
      { resumeUrl },
      {
        timeout: 15000,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    res.json(aiRes.data);

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);

    res.status(500).json({
      msg: "AI fetch failed ❌",
      error: error.response?.data || error.message
    });
  }
});

export default router;