import api from '../api/axios';
import type { UploadedFile, DownloadResponse } from '../types/files';

export const fileService = {
  getAllFiles: async (): Promise<UploadedFile[]> => {
    const response = await api.get<UploadedFile[]>('/files/');
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

  uploadFile: async (file: File, format: string): Promise<UploadedFile> => {
    const formData = new FormData();
    const userId = localStorage.getItem("user_id");
    const userDataRaw = localStorage.getItem("user_data");
    
    let facultyId = 1;
    if (userDataRaw) {
      try {
        const userData = JSON.parse(userDataRaw);
        const rawFacultyId = userData.faculty_id ?? userData.faculty?.id ?? userData.faculty;
        const parsedFacultyId = Number(rawFacultyId);
        facultyId = Number.isFinite(parsedFacultyId) && parsedFacultyId > 0 ? parsedFacultyId : 1;
      } catch (e) {
        console.error(e);
      }
    }

    const metadata = JSON.stringify({
      format: format,
      semester: 1,
      faculty: facultyId,
      user: userId ? parseInt(userId) : null
    });

    formData.append("file", file);
    formData.append("data", metadata);

    const response = await api.post<UploadedFile>('/files/', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data'
      },
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
