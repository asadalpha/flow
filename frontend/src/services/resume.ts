import axios from 'axios';
import api from './api';

export const analyzeResume = async (data: { resumeFile?: File; resumeText?: string; jobDescription: string }) => {
    const formData = new FormData();

    if (data.resumeFile) {
        formData.append('resume', data.resumeFile);
    } else if (data.resumeText) {
        formData.append('resumeText', data.resumeText);
    }

    formData.append('jobDescription', data.jobDescription);

    const token = localStorage.getItem('token');
    const response = await axios.post(`${api.defaults.baseURL}/resume/analyze`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getAnalyses = async () => {
    const response = await api.get('/resume');
    return response.data;
};
