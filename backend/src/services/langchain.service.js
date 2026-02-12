import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { Document } from "@langchain/core/documents";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const parsePDFBuffer = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return new Document({
      pageContent: data.text,
      metadata: {
        totalPages: data.numpages,
        info: data.info,
      },
    });
  } catch (error) {
    console.error("PDF Parse Error:", error);
    throw new Error("Failed to parse PDF content");
  }
};

export const analyzeResumeWithLangChain = async (
  resumeText,
  jobDescription
) => {
  try {
    console.log(
      `Starting analysis. Resume length: ${resumeText?.length}, JD length: ${jobDescription?.length}`
    );

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-3-flash-preview",
      maxOutputTokens: 2048,
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.2, // Low temperature for consistent analysis
    });

    // Define the output schema
    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        matchScore: z.number().describe("0-100 score indicating match quality"),
        missingSkills: z
          .array(z.string())
          .describe(
            "List of critical skills present in JD but missing in resume"
          ),
        strengths: z.array(z.string()).describe("List of matched strengths"),
        suggestions: z.array(z.string()).describe("Actionable improvements"),
      })
    );

    const prompt = PromptTemplate.fromTemplate(
      `You are an expert AI Resume Analyzer and Career Coach.
            
            Analyze the following resume against the job description.
            Focus on hard skills, experience years, and quantifying achievements.
            
            RESUME CONTENT:
            {resumeText}
            
            JOB DESCRIPTION:
            {jobDescription}
            
            Calculate a strict match score. Provide specific, actionable advice.
            
            {format_instructions}`
    );

    const chain = prompt.pipe(model).pipe(parser);

    const response = await chain.invoke({
      resumeText: resumeText,
      jobDescription: jobDescription,
      format_instructions: parser.getFormatInstructions(),
    });

    console.log("Analysis successful");
    return response;
  } catch (error) {
    console.error(
      "LangChain Analysis Detailed Error:",
      JSON.stringify(error, null, 2)
    );
    console.error("Stack Trace:", error.stack);
    throw new Error(
      "Failed to analyze resume with AI service: " + error.message
    );
  }
};
