import api from "./api";

export const analyzeResume = async (data: {
  resumeFile?: File;
  resumeText?: string;
  jobDescription: string;
}) => {
  const formData = new FormData();

  if (data.resumeFile) {
    formData.append("resume", data.resumeFile);
  } else if (data.resumeText) {
    formData.append("resumeText", data.resumeText);
  }

  formData.append("jobDescription", data.jobDescription);

  const response = await api.post("/resume/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAnalyses = async () => {
  const response = await api.get("/resume");
  return response.data;
};
