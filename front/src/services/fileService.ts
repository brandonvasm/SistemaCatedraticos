import api from '../api/axios';
import type { UploadedFile, DownloadResponse } from '../types/files';

export const fileService = {
  getAllFiles: async (filters?: { 
    faculty?: number; 
    format?: string; 
    semester?: number; 
    user?: number 
  }): Promise<UploadedFile[]> => {
    const response = await api.get<UploadedFile[]>('/files/', { 
      params: filters 
    });
    return Array.isArray(response.data) ? response.data : [];
  },
  
  getDownloadUrl: async (fileId: number): Promise<string> => {
    const response = await api.get<DownloadResponse>(`/files/${fileId}/download/`);
    return response.data.download_url;
  },

  deleteFile: async (fileId: number): Promise<void> => {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];

    await api.delete(`/files/${fileId}/`, {
      headers: {
        ...(csrfToken && { 'X-CSRFToken': csrfToken })
      },
      withCredentials: true
    });
  },

  uploadFile: async (
    file: File, 
    format: string, 
    semesterId: number, 
    userId: number,
    facultyId: number
  ): Promise<UploadedFile> => {
    const formData = new FormData();

    const metadata = JSON.stringify({
      format: format,
      semester: semesterId,
      faculty: facultyId,
      user: userId
    });

    formData.append("file", file);
    formData.append("data", metadata);

    const response = await api.post<UploadedFile>('/files/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    });

    return response.data;
  },

  processFile: async (fileId: number): Promise<{ message: string }> => {
    const response = await api.post(`/files/${fileId}/process/`, {}, {
      withCredentials: true
    });
    return response.data;
  }
};
