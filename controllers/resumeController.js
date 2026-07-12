// Write your code here
import { parseResume } from "../utils/resumeParser.js";
import { extractKeywords } from "../utils/keywordExtractor.js";
import { calculateATSScore } from "../utils/atsScore.js";
import { analyzeWithGemini } from "../utils/aiAnalyzer.js";
import Resume from "../models/Resume.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert Buffer → Uint8Array
    const uint8Array = new Uint8Array(req.file.buffer);

    // Parse PDF
    const text = await parseResume(uint8Array);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No text extracted from PDF" });
    }

    console.log("Resume parsed. Length:", text.length);

    res.json({
      success: true,
      preview: text.substring(0, 500),
      text
    });

  } catch (err) {
    console.error("Upload Resume Error:", err);
    res.status(500).json({ error: err.message });
  }
};
export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription, title } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "Missing resumeText or jobDescription" });
    }

    const jdKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resumeText);
    const score = calculateATSScore(jdKeywords, resumeKeywords);
    const suggestions = await analyzeWithGemini(resumeText, jobDescription);

    const savedResume = await Resume.create({
      userId: req.user?.id,
      title: title || "Untitled Analysis",
      text: resumeText,
      jobDescription,
      atsScore: score,
      suggestions,
    });

    res.json({
      success: true,
      score,
      suggestions,
      savedResumeId: savedResume._id,
    });
  } catch (err) {
    console.error("Analyze Resume Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json({ success: true, resumes });
  } catch (err) {
    console.error("Get User Resumes Error:", err);
    res.status(500).json({ error: err.message });
  }
};