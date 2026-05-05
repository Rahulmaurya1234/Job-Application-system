import express from "express";
import upload from "../config/multer.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          msg: "Only PDF/DOC files allowed",
        });
      }

      console.log("FILE OBJECT:", req.file);

      
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      
      const resumeUrl = rawUrl.replace("/upload/", "/raw/upload/");

      console.log("Saved Resume URL:", resumeUrl);

      if (!resumeUrl) {
        return res.status(500).json({
          msg: "Upload failed - no URL",
        });
      }

      
      user.resume = resumeUrl;
      await user.save();

      res.json({
        success: true,
        msg: "Resume uploaded",
        resume: user.resume,
      });

    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      res.status(500).json({ msg: "Upload failed" });
    }
  }
);

export default router;