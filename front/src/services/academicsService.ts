import api from "../api/axios";
import type { Faculty } from "../types/faculty";

export const academicsService = {
  getFaculties: async (): Promise<Faculty[]> => {
    try {
      const response = await api.get<Faculty[]>("/academics/faculties/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getFacultyById: async (id: number): Promise<Faculty> => {
    try {
      const response = await api.get<Faculty>(`/academics/faculties/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createFaculty: async (name: string): Promise<Faculty> => {
    try {
      const response = await api.post<Faculty>("/academics/faculties/", { name });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadPensum: async (facultyId: number, formData: FormData): Promise<void> => {
    await api.post(`/academics/faculties/${facultyId}/upload-pensum/`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }

};