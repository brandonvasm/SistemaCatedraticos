import api from '../api/axios';
import type {
  UploadedFile,
  DownloadResponse,
  ProcessFileResponse,
  ProcessFileStatus,
} from '../types/files';

const sleep = (milliseconds: number) => (
  new Promise(resolve => setTimeout(resolve, milliseconds))
);

const getApiErrorMessage = (error: any): string => {
  const data = error?.response?.data;

  if (typeof data === 'string' && data.trim()) {
    const looksLikeHtml = data.includes('<html') || data.includes('<!DOCTYPE');
    if (!looksLikeHtml) return data;
  }

  if (data && typeof data === 'object') {
    const firstError = data.first_error || data.result?.first_error;
    const insertError = data.insert_result?.errors?.[0] || data.result?.insert_result?.errors?.[0];
    const mainError = data.error || data.detail || data.message;
    const validationError = data.non_field_errors?.[0];

    return firstError || insertError || mainError || validationError || error.message;
  }

  return error?.message || 'No se pudo completar la solicitud';
};

const getProcessErrorMessage = (status: ProcessFileStatus): string => {
  const detail = (
    status.first_error ||
    status.error ||
    status.insert_result?.errors?.[0] ||
    status.result?.first_error ||
    status.result?.error ||
    status.result?.insert_result?.errors?.[0] ||
    'No se pudo procesar el archivo'
  );
  const fileName = status.file_name || status.result?.file_name;

  if (!fileName || detail.includes(fileName)) return detail;

  return `${fileName}: ${detail}`;
};

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

  processFile: async (fileId: number): Promise<ProcessFileResponse> => {
    try {
      const response = await api.post(`/files/${fileId}/process/`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getProcessStatus: async (fileId: number, taskId: string): Promise<ProcessFileStatus> => {
    try {
      const response = await api.get<ProcessFileStatus>(`/files/${fileId}/process-status/`, {
        params: { task_id: taskId },
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  waitForProcess: async (
    fileId: number,
    taskId: string,
    options?: {
      intervalMs?: number;
      timeoutMs?: number;
      onStatus?: (status: ProcessFileStatus) => void;
    }
  ): Promise<ProcessFileStatus> => {
    const intervalMs = options?.intervalMs ?? 2000;
    const timeoutMs = options?.timeoutMs ?? 10 * 60 * 1000;
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      const status = await fileService.getProcessStatus(fileId, taskId);
      options?.onStatus?.(status);

      const hasFailed = (
        status.state === 'FAILURE' ||
        status.status === 'failed' ||
        status.result?.status === 'failed' ||
        Boolean(status.error || status.first_error)
      );

      if (hasFailed) throw new Error(getProcessErrorMessage(status));
      if (status.state === 'SUCCESS') return status;

      await sleep(intervalMs);
    }

    throw new Error('El procesamiento sigue en curso y excedió el tiempo máximo de espera.');
  }
};
