import path from "path";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const getExtension = (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext) return ext;

  switch (file.mimetype) {
    case "application/pdf":
      return ".pdf";
    case "application/msword":
      return ".doc";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return ".docx";
    default:
      return "";
  }
};

const getSafePublicId = (file) => {
  const extension = getExtension(file);
  const name = path
    .basename(file.originalname, path.extname(file.originalname))
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 100);

  return `${name || "resume"}-${Date.now()}${extension}`;
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "resumes",
    resource_type: "raw",
    public_id: getSafePublicId(file),
  }),
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype.includes("word")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF/DOC allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;