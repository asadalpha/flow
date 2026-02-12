import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Analysis must belong to a user'],
  },
  jobDescription: {
    type: String,
    required: true,
  },
  resumeText: {
    type: String, // Store extracted text or link to file
    required: true,
  },
  matchScore: {
    type: Number,
    required: true,
  },
  missingSkills: [String],
  strengths: [String],
  suggestions: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
export default ResumeAnalysis;
