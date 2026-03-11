import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function testDirectGemini() {
  console.log("Testing Gemini API directly...");
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = "Hello, how are you?";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Response:", text);
  } catch (error) {
    console.error("Direct Gemini API Error Details:");
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Stack:", error.stack);
    if (error.response) {
      console.error("Response Data:", JSON.stringify(error.response, null, 2));
    }
  }
}

testDirectGemini();
