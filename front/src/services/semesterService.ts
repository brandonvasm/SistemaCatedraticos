
import api from "../api/axios";
import type { Semester } from "../types/semester";



export const semesterService = {

  getCurrentSemester: async (): Promise<Semester> => {
    try {
      const response = await api.get<Semester>("/academics/semesters/current/");
      return response.data;
    } catch (error) {
      console.error("Error al obtener el semestre actual:", error);
      throw error;
    }
  },

  closeSemester: async () => {
    const response = await api.post("/academics/semesters/close/");
    return response.data;
  },

  createSemester: async (data: { year: number, number: number, faculty: number }) => {
    const response = await api.post("/academics/semesters/", {
      ...data,
      ceat_loaded: false,
      comments_loaded: false,
      control_loaded: false,
      evaluation_loaded: false,
      status: "uploading"
    });
    return response.data;
  }
};