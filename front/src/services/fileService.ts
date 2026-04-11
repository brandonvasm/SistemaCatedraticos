import api from "../api/axios";

export type UploadedFile = {
  id: string | number;
  name: string;
  upload_date: string;
  status: 'success' | 'warning' | 'error';
  download_url?: string;
};

export const getUploadHistory = async (): Promise<UploadedFile[]> => {
  try {
    const response = await api.get<UploadedFile[]>("/academics/upload-history/");
    return response.data || [];
  } catch (error: any) {
    throw error.response?.data || new Error("ERROR AL OBTENER HISTORIAL");
  }
};

export const downloadFile = async (fileId: string | number, fileName: string) => {
  try {
    const response = await api.get(`/academics/download/${fileId}/`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'archivo.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al descargar el archivo", error);
  }
};