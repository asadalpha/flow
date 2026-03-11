import dotenv from "dotenv";
import { analyzeResumeWithLangChain } from "./services/langchain.service.js";

dotenv.config();

const runTest = async () => {
  const resumeText =
    "Software Engineer with 5 years of experience in JavaScript, React, and Node.js.";
  const jobDescription =
    "Looking for a Senior Software Engineer with strong TypeScript and AWS skills.";

  try {
    console.log("Testing LangChain Analysis...");
    const result = await analyzeResumeWithLangChain(resumeText, jobDescription);
    console.log("Analysis Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Test Failed:", error);
  }
};

runTest();
