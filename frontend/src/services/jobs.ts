import api from './api';

export const getJobs = async (filters: any) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/jobs?${params}`);
    return response.data;
};

export const createJob = async (jobData: any) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
};

export const updateJob = async (id: string, jobData: any) => {
    const response = await api.patch(`/jobs/${id}`, jobData);
    return response.data;
};

export const deleteJob = async (id: string) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
};

export const getJobStats = async () => {
    const response = await api.get('/jobs/stats');
    return response.data;
};
