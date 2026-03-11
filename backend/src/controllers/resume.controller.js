import {
  analyzeResumeWithLangChain,
  parsePDFBuffer,
} from "../services/langchain.service.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const analyzeResume = catchAsync(async (req, res, next) => {
  // Limit check: 1 analysis per account
  const existingAnalysis = await ResumeAnalysis.findOne({ user: req.user.id });
  if (existingAnalysis) {
    return next(
      new AppError(
        "You've reached your limit of 1 analysis per account. More tries coming soon!",
        403,
      ),
    );
  }

  let { resumeText, jobDescription } = req.body;

  // If PDF uploaded, extract text using LangChain service
  if (req.file?.buffer) {
    try {
      const doc = await parsePDFBuffer(req.file.buffer);
      resumeText = doc.pageContent;

      if (!resumeText || resumeText.trim().length < 50) {
        return next(
          new AppError(
            "Could not extract readable text from PDF. Please upload a valid text-based PDF.",
            400,
          ),
        );
      }
    } catch (err) {
      console.error("PDF parsing error:", err);
      return next(new AppError("Invalid or corrupted PDF file.", 400));
    }
  }

  if (!resumeText || !jobDescription) {
    return next(
      new AppError(
        "Please provide resume (PDF or text) and job description.",
        400,
      ),
    );
  }

  // AI Analysis (LangChain)
  const analysisResult = await analyzeResumeWithLangChain(
    resumeText,
    jobDescription,
  );

  if (!analysisResult) {
    return next(new AppError("AI analysis failed. Please try again.", 500));
  }

  // Save result
  const analysis = await ResumeAnalysis.create({
    user: req.user.id,
    resumeText,
    jobDescription,
    ...analysisResult,
  });

  res.status(201).json({
    status: "success",
    data: { analysis },
  });
});

export const getAllAnalyses = catchAsync(async (req, res) => {
  const analyses = await ResumeAnalysis.find({ user: req.user.id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: "success",
    results: analyses.length,
    data: { analyses },
  });
});
