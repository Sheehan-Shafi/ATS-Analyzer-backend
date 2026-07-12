// Write your code here
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import { uploadResume, analyzeResume, getUserResumes } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);
router.post("/analyze", authMiddleware, analyzeResume);
router.get("/history", authMiddleware, getUserResumes);

export default router;