import express from "express";
import axios from "axios";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/jobs", protect, async (req, res) => {
  try {
    console.log("🔍 AI Jobs API Hit");

    // 🔹 Get user
    const user = await User.findById(req.user._id);

    if (!user || !user.resume) {
      return res.status(400).json({
        success: false,
        msg: "No resume uploaded ❌"
      });
    }

    let resumeUrl = user.resume;

    // 🔥 Fix old Cloudinary URLs
    if (resumeUrl.includes("/upload/") && !resumeUrl.includes("/raw/upload/")) {
      resumeUrl = resumeUrl.replace("/upload/", "/raw/upload/");
    }

    // 🔥 Ensure .pdf extension
    if (!resumeUrl.endsWith(".pdf")) {
      resumeUrl += ".pdf";
    }

    console.log("📄 Resume URL:", resumeUrl);

    // 🔹 Call AI service (IMPORTANT)
    const aiRes = await axios.post(
      "https://job-application-system-1.onrender.com/analyze",
      { resumeUrl },
      {
        timeout: 20000, // 🔥 avoid 502
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // 🔹 Safety checks
    if (!aiRes || !aiRes.data) {
      return res.status(400).json({
        success: false,
        msg: "No response from AI ❌"
      });
    }

    // 🔹 If AI returned error
    if (aiRes.data.error) {
      return res.status(400).json({
        success: false,
        msg: "AI error ❌",
        error: aiRes.data.error
      });
    }

    // 🔹 Validate jobs
    if (!aiRes.data.jobs || !Array.isArray(aiRes.data.jobs)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid AI response format ❌"
      });
    }

    console.log("✅ AI Success, jobs count:", aiRes.data.jobs.length);

    // 🔹 Final response
    res.json({
      success: true,
      jobs: aiRes.data.jobs
    });

  } catch (error) {
    console.error("❌ AI ERROR:", error.message);

    // 🔥 Timeout case
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        msg: "AI timeout, try again ❌"
      });
    }

    // 🔥 AI service down
    if (error.response?.status >= 500) {
      return res.status(502).json({
        success: false,
        msg: "AI service unavailable ❌"
      });
    }

    // 🔥 Default error
    res.status(500).json({
      success: false,
      msg: "Server error ❌",
      error: error.message
    });
  }
});

export default router;