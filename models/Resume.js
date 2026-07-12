// Write your code here
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  text: String,
  jobDescription: String,
  atsScore: Number,
  suggestions: Array
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);