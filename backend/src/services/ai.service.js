import { GoogleGenerativeAI } from '@google/generative-ai';

// AI API key function
const getKey = () => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("GEMINI_API_KEY is missing");
        throw new Error("GEMINI_API_KEY is missing");
    }
    return key;
}

export const analyzeResumeWithAI = async (resumeText, jobDescription) => {
  try {
    const genAI = new GoogleGenerativeAI(getKey());
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json"
         }
    });

    const prompt = `
      You are an expert AI Resume Analyzer and Career Coach.
      
      Task: Analyze the provided RESUME against the JOB DESCRIPTION (JD).
      
      RESUME CONTENT:
      "${resumeText.substring(0, 10000)}"
      
      JOB DESCRIPTION:
      "${jobDescription.substring(0, 5000)}"
      
      Calculate a semantic match score (0-100) based on skills, experience, and relevance.
      Identify missing critical skills from the JD that are not in the resume.
      Identify strengths in the resume relevant to the JD.
      Provide actionable suggestions to improve the resume for this specific role.
      
      Output strictly valid JSON with this structure:
      {
        "matchScore": number,
        "missingSkills": ["skill1", "skill2"],
        "strengths": ["strength1", "strength2"],
        "suggestions": ["suggestion1", "suggestion2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown code blocks if the model behaves unexpectedly (though mimeType json helps)
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error('Failed to analyze resume with AI');
  }
};
