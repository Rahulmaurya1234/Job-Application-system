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
      // file check
      if (!req.file) {
        return res.status(400).json({
          msg: "Only PDF/DOC files allowed",
        });
      }

      // user check
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // ✅ Cloudinary URL save
      user.resume = req.file.path;

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